const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PORT = 8080;

// Database query helpers using execFileSync for absolute safety against shell injection / space splitting
function queryDb(sql) {
    const dbPath = path.join(__dirname, 'storage', 'federation.db');
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    try {
        const output = execFileSync('sqlite3', ['-json', dbPath], { input: sql }).toString().trim();
        return output ? JSON.parse(output) : [];
    } catch (err) {
        console.error("SQL Query error:", err.message);
        return [];
    }
}

function executeSql(sql) {
    const dbPath = path.join(__dirname, 'storage', 'federation.db');
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    try {
        execFileSync('sqlite3', [dbPath], { input: sql });
    } catch (err) {
        console.error("SQL Execute error:", err.message);
    }
}

// Synchronously initialize database schemas and seed default records
function initializeDatabase() {
    console.log("Initializing SQLite database...");
    const dbPath = path.join(__dirname, 'storage', 'federation.db');
    if (fs.existsSync(dbPath)) {
        console.log("Database file already exists.");
        return;
    }
    
    const schemaSql = `
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );

        CREATE TABLE IF NOT EXISTS athletes (
            id TEXT PRIMARY KEY,
            first_name TEXT,
            last_name TEXT,
            personal_id TEXT,
            status TEXT,
            member_since TEXT,
            is_federation_member INTEGER,
            is_national_team_member INTEGER,
            mountaineer_rank TEXT,
            location_status TEXT,
            points INTEGER,
            achievements TEXT,
            medical_certificate_expiry TEXT
        );

        CREATE TABLE IF NOT EXISTS warehouse_items (
            id TEXT PRIMARY KEY,
            name TEXT,
            category TEXT,
            qty_total INTEGER,
            qty_left INTEGER,
            qr TEXT
        );

        CREATE TABLE IF NOT EXISTS warehouse_transactions (
            id TEXT PRIMARY KEY,
            type TEXT,
            item_id TEXT,
            item_name TEXT,
            athlete_id TEXT,
            athlete_name TEXT,
            issue_date TEXT,
            expected_return_date TEXT,
            status TEXT,
            qty INTEGER,
            expedition_name TEXT,
            components TEXT,
            item_code TEXT
        );

        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            athlete_id TEXT,
            date TEXT,
            time TEXT,
            location TEXT,
            severity TEXT,
            description TEXT,
            status TEXT
        );

        CREATE TABLE IF NOT EXISTS expeditions (
            id TEXT PRIMARY KEY,
            peak TEXT,
            difficulty TEXT,
            team_size INTEGER,
            status TEXT
        );

        CREATE TABLE IF NOT EXISTS partnerships (
            id TEXT PRIMARY KEY,
            name TEXT,
            type TEXT,
            status TEXT,
            description TEXT,
            start_date TEXT,
            end_date TEXT,
            contract_file_url TEXT,
            partnership_form TEXT
        );
    `;
    
    executeSql(schemaSql);
    
    // Create Views
    const viewsSql = `
        CREATE VIEW IF NOT EXISTS view_warehouse_pulse AS
        SELECT
            (SELECT COUNT(*) FROM warehouse_transactions WHERE status = 'issued' AND expected_return_date < '2026-05-25') AS overdue_count,
            (SELECT COUNT(*) FROM incidents WHERE severity = 'მაღალი') AS recent_incidents,
            (SELECT COALESCE(SUM(qty), 0) FROM warehouse_transactions WHERE status = 'issued') AS active_gear_outside;

        CREATE VIEW IF NOT EXISTS view_overdue_items AS
        SELECT
            athlete_name,
            item_name AS item,
            CAST(julianday('2026-05-25') - julianday(expected_return_date) AS INTEGER) AS days_overdue
        FROM warehouse_transactions
        WHERE status = 'issued' AND expected_return_date < '2026-05-25';

        CREATE VIEW IF NOT EXISTS view_member_analytics AS
        SELECT
            (SELECT COUNT(*) FROM athletes) AS total_active_members,
            (SELECT COUNT(*) FROM athletes WHERE location_status = 'მთაშია') AS in_the_mountains,
            (SELECT COUNT(*) FROM athletes WHERE location_status = 'ბაზაზეა') AS at_base,
            (SELECT COUNT(*) FROM athletes WHERE mountaineer_rank IN ('BADGE', 'RANK_3', 'RANK_2')) AS beginner,
            (SELECT COUNT(*) FROM athletes WHERE mountaineer_rank = 'RANK_1') AS first_rank,
            (SELECT COUNT(*) FROM athletes WHERE mountaineer_rank IN ('CANDIDATE', 'MASTER', 'INT_MASTER')) AS master;

        CREATE VIEW IF NOT EXISTS view_active_expeditions AS
        SELECT peak, difficulty AS route_difficulty, team_size
        FROM expeditions
        WHERE status = 'active';

        CREATE VIEW IF NOT EXISTS view_partnership_pipeline AS
        SELECT COUNT(*) AS active_partners_count
        FROM partnerships
        WHERE type = 'PARTNER' AND status = 'active';

        CREATE VIEW IF NOT EXISTS view_active_sponsors AS
        SELECT
            name,
            CAST(julianday(end_date) - julianday('2026-05-25') AS INTEGER) AS days_left
        FROM partnerships
        WHERE type = 'SPONSOR' AND status = 'active';
    `;
    
    executeSql(viewsSql);
    
    console.log("Seeding database...");
    
    // Seed initial records
    let seedSql = `
        BEGIN TRANSACTION;
        INSERT INTO settings (key, value) VALUES ('ratingCalculationEnabled', 'true');
        INSERT INTO settings (key, value) VALUES ('ranksEnabled', 'true');
        
        INSERT INTO expeditions (id, peak, difficulty, team_size, status) VALUES ('1', 'მყინვარწვერი', '2B', 4, 'active');
        
        INSERT INTO incidents (id, athlete_id, date, time, location, severity, description, status) VALUES ('1', '860642', '2026-05-15', '10:30', 'ცენტრალური მოედანი', 'მაღალი', 'მძიმე ტრავმა', 'მიმდინარე');
        INSERT INTO incidents (id, athlete_id, date, time, location, severity, description, status) VALUES ('2', '860640', '2026-05-16', '14:00', 'ყინულვარდნილი', 'მაღალი', 'ფეხის მოტეხილობა', 'მიმდინარე');
    `;
    
    // Seed partnerships
    const defaultPartnerships = [
      { id: "PTN-2026-01", type: "SPONSOR", name: "Red Bull Georgia", start: "2026-01-01", end: "2026-07-04", desc: "ზამთრის ჩემპიონატის გენერალური სპონსორი.", file: "/storage/contracts/redbull_2026.pdf", form: null },
      { id: "PTN-2026-02", type: "PARTNER", name: "Alta", start: "2026-01-01", end: "2026-12-31", desc: "ტექნიკური მხარდაჭერა და ეკიპირების უზრუნველყოფა.", file: null, form: "ეკიპირების პარტნიორი" },
      { id: "PTN-2026-03", type: "PARTNER", name: "Aversi", start: "2026-01-01", end: "2026-12-31", desc: "სამედიცინო მხარდაჭერა და უფასო დაზღვევა სპორტსმენებისთვის.", file: null, form: "სამედიცინო მხარდაჭერა" },
      { id: "PTN-2026-04", type: "PARTNER", name: "Silknet", start: "2026-01-01", end: "2026-12-31", desc: "საკომუნიკაციო მხარდაჭერა და ინტერნეტი ბაზებზე.", file: null, form: "კავშირგაბმულობის პარტნიორი" },
      { id: "PTN-2026-05", type: "PARTNER", name: "Guda", start: "2026-02-01", end: "2026-12-31", desc: "ლოჯისტიკა და ტრანსპორტირება ექსპედიციებისთვის.", file: null, form: "ლოჯისტიკის პარტნიორი" },
      { id: "PTN-2026-06", type: "PARTNER", name: "Lilo Mall", start: "2026-01-10", end: "2026-12-31", desc: "ინვენტარის პარტნიორი და ფასდაკლებები საწყობისთვის.", file: null, form: "ინვენტარის პარტნიორი" },
      { id: "PTN-2026-07", type: "PARTNER", name: "Water Co", start: "2026-03-01", end: "2026-12-31", desc: "სასმელი წყლის მიწოდება მთაში მყოფი წევრებისთვის.", file: null, form: "წყლის მიწოდება" },
      { id: "PTN-2026-08", type: "PARTNER", name: "Active Life", start: "2026-01-01", end: "2026-12-31", desc: "ფიტნეს პარტნიორი და საწვრთნელი დარბაზი.", file: null, form: "საწვრთნელი პარტნიორი" },
      { id: "PTN-2026-09", type: "PARTNER", name: "Mountain Rescue", start: "2026-01-01", end: "2026-12-31", desc: "სამაშველო კავშირი და უსაფრთხოების მემორანდუმი.", file: null, form: "სამაშველო პარტნიორი" }
    ];
    for (const p of defaultPartnerships) {
        seedSql += `INSERT INTO partnerships (id, name, type, status, description, start_date, end_date, contract_file_url, partnership_form) VALUES (` +
            `'${p.id}', '${p.name}', '${p.type}', 'active', '${p.desc}', '${p.start}', '${p.end}', ` +
            `${p.file ? `'${p.file}'` : 'NULL'}, ${p.form ? `'${p.form}'` : 'NULL'});\n`;
    }

    // Seed transactions
    const defaultTransactions = [
      { id: "t1", type: "item", itemId: "1", itemName: "თოკი ალპინისტური 60მ", athleteId: "860640", athleteName: "გიორგი ლეკიშვილი", issueDate: "2026-05-10", expectedReturnDate: "2026-05-19", status: "issued", qty: 5, itemCode: "QR-ER89-001" },
      { id: "t2", type: "item", itemId: "2", itemName: "კარაბინი სიმეტრიული", athleteId: "860641", athleteName: "დავით მაისურაძე", issueDate: "2026-05-05", expectedReturnDate: "2026-05-20", status: "issued", qty: 10, itemCode: "QR-PA-091" },
      { id: "t3", type: "item", itemId: "3", itemName: "ალპინისტური წერაყინი", athleteId: "860644", athleteName: "ნიკოლოზ ყიფიანი", issueDate: "2026-05-01", expectedReturnDate: "2026-05-18", status: "issued", qty: 3, itemCode: "QR-MSR-004" },
      { id: "t4", type: "item", itemId: "4", itemName: "ჩაფხუტი დამცავი", athleteId: "860645", athleteName: "ირაკლი გელოვანი", issueDate: "2026-05-08", expectedReturnDate: "2026-05-21", status: "issued", qty: 4, itemCode: "QR-PM-042" },
      { id: "t5", type: "item", itemId: "5", itemName: "საძილე ტომარა მინუს 20", athleteId: "860643", athleteName: "ლუკა ლომიძე", issueDate: "2026-05-01", expectedReturnDate: "2026-05-15", status: "issued", qty: 2, itemCode: "QR-SB-115" },
      { id: "t6", type: "item", itemId: "6", itemName: "დინამიკური თოკი (Edelrid Swift 8.9mm)", athleteId: "860642", athleteName: "არჩილ ბადრიაშვილი", issueDate: "2026-05-15", expectedReturnDate: "2026-05-28", status: "issued", qty: 18, itemCode: "QR-ER89-001" }
    ];
    for (const t of defaultTransactions) {
        seedSql += `INSERT INTO warehouse_transactions (id, type, item_id, item_name, athlete_id, athlete_name, issue_date, expected_return_date, status, qty, expedition_name, components, item_code) VALUES (` +
            `'${t.id}', '${t.type}', '${t.itemId}', '${t.itemName}', '${t.athleteId}', '${t.athleteName}', '${t.issueDate}', '${t.expectedReturnDate}', '${t.status}', ${t.qty}, '', '', '${t.itemCode || ''}');\n`;
    }
    
    // Seed 148 athletes programmatically to keep file small
    const firstNames = [
      "დავით", "გიორგი", "ლუკა", "ირაკლი", "ნიკოლოზ", "ალექსანდრე", "შალვა", "ლევან", "მიხეილ", "ზურაბ",
      "ანდრია", "ოთარ", "თეიმურაზ", "ზვიად", "მერაბ", "აკაკი", "კონსტანტინე", "ვაჟა", "ნოდარ", "ემზარ",
      "თორნიკე", "გიგა", "ბექა", "საბა", "ილია", "თამაზ", "ჯაბა", "გელა", "რეზო", "ბაჩო",
      "ანზორ", "ვახტანგ", "ნუკრი", "მალხაზ", "რევაზ", "თენგიზ", "ოთარი", "ზაზა", "გოჩა"
    ];
    const lastNames = [
      "ბადრიაშვილი", "ბერიძე", "მაისურაძე", "ლეკიშვილი", "ყიფიანი", "გელოვანი", "ლომიძე", "მარგიანი",
      "ნემსაძე", "კოხრეიძე", "კიკნაძე", "დევდარიანი", "აფრასიძე", "ჭელიძე", "გვენეტაძე", "აბაშიძე",
      "ჩხეიძე", "გაბუნია", "ქარდავა", "კვარაცხელია", "გორგაძე", "შენგელია", "მჟავანაძე", "ჯაფარიძე",
      "თვალავაძე", "ახალკაცი", "გოგიჩაიშვილი", "თოდუა", "ცინცაძე", "კალანდაძე", "მესხი", "გაბრიჩიძე"
    ];
    
    const remainingRanks = [
      ...Array(14).fill("BADGE"), ...Array(14).fill("RANK_3"), ...Array(9).fill("RANK_2"),
      ...Array(14).fill("RANK_1"), ...Array(2).fill("CANDIDATE"), ...Array(1).fill("MASTER"),
      ...Array(88).fill("NONE")
    ];
    for (let i = remainingRanks.length - 1; i > 0; i--) {
      const j = (i * 9301 + 49297) % 233280 % (i + 1);
      const temp = remainingRanks[i];
      remainingRanks[i] = remainingRanks[j];
      remainingRanks[j] = temp;
    }
    
    for (let i = 0; i < 148; i++) {
      const locationStatus = i < 12 ? "მთაშია" : "ბაზაზეა";
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
      
      let finalFirstName = firstName;
      let finalLastName = lastName;
      let finalRank;
      
      if (i === 0) {
        finalFirstName = "გიორგი";
        finalLastName = "ლეკიშვილი";
        finalRank = "RANK_3";
      } else if (i === 1) {
        finalFirstName = "დავით";
        finalLastName = "მაისურაძე";
        finalRank = "MASTER";
      } else if (i === 2) {
        finalFirstName = "არჩილ";
        finalLastName = "ბადრიაშვილი";
        finalRank = "INT_MASTER";
      } else if (i === 3) {
        finalFirstName = "ლუკა";
        finalLastName = "ლომიძე";
        finalRank = "RANK_1";
      } else if (i === 4) {
        finalFirstName = "ნიკოლოზ";
        finalLastName = "ყიფიანი";
        finalRank = "RANK_2";
      } else if (i === 5) {
        finalFirstName = "ირაკლი";
        finalLastName = "გელოვანი";
        finalRank = "BADGE";
      } else {
        finalRank = remainingRanks[i - 6];
      }
      
      const athleteId = String(860640 + i);
      const personalId = "010" + String(10000000 + i);
      let points = 50 + (i % 20) * 10;
      if (finalFirstName === "დავით" && finalLastName === "მაისურაძე") points = 450;
      else if (finalFirstName === "გიორგი" && finalLastName === "ლეკიშვილი") points = 310;
      else if (finalFirstName === "ლუკა" && finalLastName === "ლომიძე") points = 380;
      
      seedSql += `INSERT INTO athletes (id, first_name, last_name, personal_id, status, member_since, is_federation_member, is_national_team_member, mountaineer_rank, location_status, points, achievements) VALUES (` +
          `'${athleteId}', '${finalFirstName}', '${finalLastName}', '${personalId}', 'აქტიური', '15/01/2020', 1, ${finalRank !== 'NONE' ? 1 : 0}, ` +
          `'${finalRank}', '${locationStatus}', ${points}, '[]');\n`;
    }
    
    seedSql += 'COMMIT;\n';
    
    executeSql(seedSql);
    console.log("Database seeding completed.");
}

// Synchronize database state with client-side state
function syncDatabase(data) {
    let sql = 'BEGIN TRANSACTION;\n';

    if (data.settings) {
        const ratingEnabled = data.settings.ratingCalculationEnabled !== false ? 'true' : 'false';
        const ranksEnabled = data.settings.ranksEnabled !== false ? 'true' : 'false';
        const honoraryEnabled = data.settings.honoraryTitlesEnabled !== false ? 'true' : 'false';
        const awardsEnabled = data.settings.awardsEnabled !== false ? 'true' : 'false';
        sql += `INSERT OR REPLACE INTO settings (key, value) VALUES ('ratingCalculationEnabled', '${ratingEnabled}');\n`;
        sql += `INSERT OR REPLACE INTO settings (key, value) VALUES ('ranksEnabled', '${ranksEnabled}');\n`;
        sql += `INSERT OR REPLACE INTO settings (key, value) VALUES ('honorary_titles_enabled', '${honoraryEnabled}');\n`;
        sql += `INSERT OR REPLACE INTO settings (key, value) VALUES ('awards_enabled', '${awardsEnabled}');\n`;
    }

    if (Array.isArray(data.athletes)) {
        sql += 'DELETE FROM athletes;\n';
        for (const a of data.athletes) {
            const isFed = a.isFederationMember ? 1 : 0;
            const isNat = a.isNationalTeamMember ? 1 : 0;
            const points = a.points || 0;
            const achievementsStr = a.achievements ? JSON.stringify(a.achievements).replace(/'/g, "''") : '[]';
            const medicalExpiryVal = a.medicalCertificateExpiry || '';
            
            sql += `INSERT INTO athletes (id, first_name, last_name, personal_id, status, member_since, is_federation_member, is_national_team_member, mountaineer_rank, location_status, points, achievements, medical_certificate_expiry) VALUES (` +
                `'${a.id.replace(/'/g, "''")}', ` +
                `'${(a.firstName || '').replace(/'/g, "''")}', ` +
                `'${(a.lastName || '').replace(/'/g, "''")}', ` +
                `'${(a.personalId || '').replace(/'/g, "''")}', ` +
                `'${(a.status || '').replace(/'/g, "''")}', ` +
                `'${(a.memberSince || '').replace(/'/g, "''")}', ` +
                `${isFed}, ${isNat}, ` +
                `'${(a.mountaineerRank || 'NONE').replace(/'/g, "''")}', ` +
                `'${(a.locationStatus || 'ბაზაზეა').replace(/'/g, "''")}', ` +
                `${points}, ` +
                `'${achievementsStr}', ` +
                `'${medicalExpiryVal.replace(/'/g, "''")}'` +
                `);\n`;
        }
    }

    if (Array.isArray(data.athlete_ranks)) {
        sql += 'DELETE FROM athlete_ranks;\n';
        for (const ar of data.athlete_ranks) {
            const arId = ar.id || 'ar-' + Math.random().toString(36).substr(2, 9);
            const athleteId = ar.athlete_id || ar.athleteId || '';
            const sportType = ar.sport_type || ar.sportDiscipline || ar.sportsDiscipline || ar.sportType || '';
            const rankName = ar.rank_name || ar.rankName || '';
            const org = ar.organization || '';
            const assDate = ar.assignment_date || ar.assignmentDate || ar.date || '';
            
            sql += `INSERT INTO athlete_ranks (id, athlete_id, sport_type, rank_name, organization, assignment_date) VALUES (` +
                `'${arId.replace(/'/g, "''")}', ` +
                `'${athleteId.replace(/'/g, "''")}', ` +
                `'${sportType.replace(/'/g, "''")}', ` +
                `'${rankName.replace(/'/g, "''")}', ` +
                `'${org.replace(/'/g, "''")}', ` +
                `'${assDate.replace(/'/g, "''")}'` +
                `);\n`;
        }
    } else {
        // Fallback: populate athlete_ranks from achievements of all athletes
        sql += 'DELETE FROM athlete_ranks;\n';
        if (Array.isArray(data.athletes)) {
            for (const a of data.athletes) {
                if (Array.isArray(a.achievements)) {
                    for (const ach of a.achievements) {
                        if (ach.type === 'rank_up') {
                            const arId = ach.id || 'ar-' + Math.random().toString(36).substr(2, 9);
                            const rankName = (ach.peak || ach.title || '').replace(/^მიენიჭა\s+["']?|["']?$/g, '');
                            const sportType = ach.route || a.sportsDiscipline || 'ალპინიზმი';
                            let org = '';
                            if (ach.achievement) {
                                const orgMatch = ach.achievement.match(/ორგანიზაცია:\s*([^.]+)/);
                                if (orgMatch) {
                                    org = orgMatch[1].trim();
                                } else {
                                    const basisMatch = ach.achievement.match(/საფუძველი:\s*([^.]+)/);
                                    org = basisMatch ? basisMatch[1].trim() : '';
                                }
                            }
                            const assDate = ach.date || ach.year || '';

                            sql += `INSERT INTO athlete_ranks (id, athlete_id, sport_type, rank_name, organization, assignment_date) VALUES (` +
                                `'${arId.replace(/'/g, "''")}', ` +
                                `'${a.id.replace(/'/g, "''")}', ` +
                                `'${sportType.replace(/'/g, "''")}', ` +
                                `'${rankName.replace(/'/g, "''")}', ` +
                                `'${org.replace(/'/g, "''")}', ` +
                                `'${String(assDate).replace(/'/g, "''")}'` +
                                `);\n`;
                        }
                    }
                }
            }
        }
    }

    if (Array.isArray(data.transactions)) {
        sql += 'DELETE FROM warehouse_transactions;\n';
        for (const t of data.transactions) {
            sql += `INSERT INTO warehouse_transactions (id, type, item_id, item_name, athlete_id, athlete_name, issue_date, expected_return_date, status, qty, expedition_name, components, item_code) VALUES (` +
                `'${t.id.replace(/'/g, "''")}', ` +
                `'${(t.type || 'item').replace(/'/g, "''")}', ` +
                `'${(t.itemId || '').replace(/'/g, "''")}', ` +
                `'${(t.itemName || '').replace(/'/g, "''")}', ` +
                `'${(t.athleteId || '').replace(/'/g, "''")}', ` +
                `'${(t.athleteName || '').replace(/'/g, "''")}', ` +
                `'${(t.issueDate || '').replace(/'/g, "''")}', ` +
                `'${(t.expectedReturnDate || '').replace(/'/g, "''")}', ` +
                `'${(t.status || 'issued').replace(/'/g, "''")}', ` +
                `${t.qty || 1}, ` +
                `'${(t.expeditionName || '').replace(/'/g, "''")}', ` +
                `'${(t.components || '').replace(/'/g, "''")}', ` +
                `'${(t.itemCode || '').replace(/'/g, "''")}'` +
                `);\n`;
        }
    }

    if (Array.isArray(data.incidents)) {
        sql += 'DELETE FROM incidents;\n';
        for (const inc of data.incidents) {
            sql += `INSERT INTO incidents (id, athlete_id, date, time, location, severity, description, status) VALUES (` +
                `'${inc.id.replace(/'/g, "''")}', ` +
                `'${(inc.athleteId || '').replace(/'/g, "''")}', ` +
                `'${(inc.date || '').replace(/'/g, "''")}', ` +
                `'${(inc.time || '').replace(/'/g, "''")}', ` +
                `'${(inc.location || '').replace(/'/g, "''")}', ` +
                `'${(inc.severity || '').replace(/'/g, "''")}', ` +
                `'${(inc.description || '').replace(/'/g, "''")}', ` +
                `'${(inc.status || '').replace(/'/g, "''")}'` +
                `);\n`;
        }
    }

    if (Array.isArray(data.partnerships)) {
        sql += 'DELETE FROM partnerships;\n';
        for (const p of data.partnerships) {
            const pId = p.partnership_id || p.id;
            sql += `INSERT INTO partnerships (id, name, type, status, description, start_date, end_date, contract_file_url, partnership_form) VALUES (` +
                `'${pId.replace(/'/g, "''")}', ` +
                `'${(p.name || '').replace(/'/g, "''")}', ` +
                `'${(p.type || '').replace(/'/g, "''")}', ` +
                `'active', ` +
                `'${(p.description || '').replace(/'/g, "''")}', ` +
                `'${(p.valid_from || '').replace(/'/g, "''")}', ` +
                `'${(p.valid_to || '').replace(/'/g, "''")}', ` +
                `${p.contract_file_url ? `'${p.contract_file_url.replace(/'/g, "''")}'` : 'NULL'}, ` +
                `${p.partnership_form ? `'${p.partnership_form.replace(/'/g, "''")}'` : 'NULL'}` +
                `);\n`;
        }
    }
    if (Array.isArray(data.calendar_events)) {
        sql += 'DELETE FROM calendar_events;\n';
        for (const e of data.calendar_events) {
            const event_date = (e.event_date || e.eventDate || '').replace(/'/g, "''");
            const event_title = (e.event_title || e.eventTitle || '').replace(/'/g, "''");
            const event_description = (e.event_description || e.eventDescription || '').replace(/'/g, "''");
            sql += `INSERT INTO calendar_events (event_date, event_title, event_description) VALUES ('${event_date}', '${event_title}', '${event_description}');\n`;
        }
    } else if (Array.isArray(data.calendarEvents)) {
        sql += 'DELETE FROM calendar_events;\n';
        for (const e of data.calendarEvents) {
            const event_date = (e.event_date || e.eventDate || '').replace(/'/g, "''");
            const event_title = (e.event_title || e.eventTitle || '').replace(/'/g, "''");
            const event_description = (e.event_description || e.eventDescription || '').replace(/'/g, "''");
            sql += `INSERT INTO calendar_events (event_date, event_title, event_description) VALUES ('${event_date}', '${event_title}', '${event_description}');\n`;
        }
    }

    sql += 'COMMIT;\n';
    executeSql(sql);
}

// Perform boot sequence
initializeDatabase();

// Re-create views dynamically to update hardcoded date to 2026-05-25 for existing databases
try {
    executeSql(`
        DROP VIEW IF EXISTS view_warehouse_pulse;
        DROP VIEW IF EXISTS view_overdue_items;
        DROP VIEW IF EXISTS view_active_sponsors;
        
        CREATE VIEW view_warehouse_pulse AS
        SELECT
            (SELECT COUNT(*) FROM warehouse_transactions WHERE status = 'issued' AND expected_return_date < '2026-05-25') AS overdue_count,
            (SELECT COUNT(*) FROM incidents WHERE severity = 'მაღალი') AS recent_incidents,
            (SELECT COALESCE(SUM(qty), 0) FROM warehouse_transactions WHERE status = 'issued') AS active_gear_outside;

        CREATE VIEW view_overdue_items AS
        SELECT
            athlete_name,
            item_name AS item,
            CAST(julianday('2026-05-25') - julianday(expected_return_date) AS INTEGER) AS days_overdue
        FROM warehouse_transactions
        WHERE status = 'issued' AND expected_return_date < '2026-05-25';

        CREATE VIEW view_active_sponsors AS
        SELECT
            name,
            CAST(julianday(end_date) - julianday('2026-05-25') AS INTEGER) AS days_left
        FROM partnerships
        WHERE type = 'SPONSOR' AND status = 'active';
    `);
} catch (e) {
    console.error("Failed to re-create views:", e);
}

// Ensure components and item_code columns exist in warehouse_transactions (migration)
try {
    executeSql("ALTER TABLE warehouse_transactions ADD COLUMN components TEXT;");
} catch (e) {
    // Column already exists, safe to ignore
}
try {
    executeSql("ALTER TABLE warehouse_transactions ADD COLUMN item_code TEXT;");
} catch (e) {
    // Column already exists, safe to ignore
}
try {
    executeSql("ALTER TABLE athletes ADD COLUMN medical_certificate_expiry TEXT;");
} catch (e) {
    // Column already exists, safe to ignore
}

// Ensure mentors table exists
executeSql(`
    CREATE TABLE IF NOT EXISTS mentors (
        id TEXT PRIMARY KEY,
        status TEXT,
        first_name TEXT,
        last_name TEXT,
        personal_id TEXT,
        birth_date TEXT,
        gender TEXT,
        nationality TEXT,
        phone TEXT,
        email TEXT,
        address TEXT,
        height INTEGER,
        weight INTEGER,
        blood_type TEXT,
        sport_types TEXT,
        category TEXT,
        biography TEXT,
        photo TEXT
    );
`);

// Seed default mentor M-101 if table is empty
const existingMentors = queryDb("SELECT COUNT(*) as count FROM mentors;");
if (existingMentors.length === 0 || existingMentors[0].count === 0) {
    executeSql(`
        INSERT INTO mentors (id, status, first_name, last_name, personal_id, birth_date, gender, nationality, phone, email, address, height, weight, blood_type, sport_types, category, biography, photo)
        VALUES ('M-101', 'მწვრთნელი', 'ზურაბ', 'კიკნაძე', '01010101011', '1975-04-12', 'male', 'GE', '+995555112233', 'z.k@example.com', 'თბილისი', 182, 80, 'O+', 'ალპინიზმი', 'I კატეგორია', 'სპორტის დამსახურებული მწვრთნელი. მრავალწლიანი გამოცდილება მაღალმთიან ექსპედიციებში.', 'https://i.pravatar.cc/150?img=33');
    `);
}

// Ensure calendar_events table exists
executeSql(`
    CREATE TABLE IF NOT EXISTS calendar_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_date TEXT NOT NULL,
        event_title TEXT NOT NULL,
        event_description TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

try {
    executeSql("ALTER TABLE calendar_events ADD COLUMN event_description TEXT NOT NULL DEFAULT '';");
} catch (e) {
    // Column already exists, safe to ignore
}

// Ensure athlete_ranks table exists
executeSql(`
    CREATE TABLE IF NOT EXISTS athlete_ranks (
        id TEXT PRIMARY KEY,
        athlete_id TEXT,
        sport_type TEXT,
        rank_name TEXT,
        organization TEXT,
        assignment_date TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

// Ensure honorary_titles table exists
executeSql(`
    CREATE TABLE IF NOT EXISTS honorary_titles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_name TEXT NOT NULL
    );
`);

// Seed default honorary titles if empty
const existingTitles = queryDb("SELECT COUNT(*) as count FROM honorary_titles;");
if (existingTitles.length === 0 || existingTitles[0].count === 0) {
    executeSql(`
        INSERT INTO honorary_titles (title_name) VALUES 
        ('თოვლის ჯიქი (Snow Leopard)'),
        ('საქართველოს დამსახურებული მწვრთნელი'),
        ('საპატიო მთამსვლელი');
    `);
}

// Ensure federation_awards table exists
executeSql(`
    CREATE TABLE IF NOT EXISTS federation_awards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        award_name TEXT NOT NULL
    );
`);

// Seed default federation awards if empty
const existingAwards = queryDb("SELECT COUNT(*) as count FROM federation_awards;");
if (existingAwards.length === 0 || existingAwards[0].count === 0) {
    executeSql(`
        INSERT INTO federation_awards (award_name) VALUES 
        ('წლის საუკეთესო სპორტსმენის თასი'),
        ('ორდენი სპორტული დამსახურებისთვის');
    `);
}

// Seed default settings for honorary_titles_enabled and awards_enabled if not exists
executeSql(`
    INSERT OR IGNORE INTO settings (key, value) VALUES ('honorary_titles_enabled', 'true');
`);
executeSql(`
    INSERT OR IGNORE INTO settings (key, value) VALUES ('awards_enabled', 'true');
`);


const compiledCache = new Map(); // filePath -> { mtime, code }

http.createServer((req, res) => {
    // Enable CORS and OPTIONS handler globally
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // GET /api/v1/dashboard/summary
    if (req.url === '/api/v1/dashboard/summary' && req.method === 'GET') {
        const warehouseRaw = queryDb('SELECT * FROM view_warehouse_pulse;');
        const warehousePulse = warehouseRaw[0] || { overdue_count: 0, recent_incidents: 0, active_gear_outside: 0 };
        
        const overdueItems = queryDb('SELECT * FROM view_overdue_items;');
        
        const memberRaw = queryDb('SELECT * FROM view_member_analytics;');
        const memberAnalytics = memberRaw[0] || { total_active_members: 0, in_the_mountains: 0, at_base: 0, beginner: 0, first_rank: 0, master: 0 };
        
        // Settings checks
        const settingsRaw = queryDb("SELECT value FROM settings WHERE key = 'ratingCalculationEnabled';");
        const isRatingEnabledSetting = settingsRaw[0] ? settingsRaw[0].value === 'true' : true;
        
        const expeditions = queryDb('SELECT * FROM view_active_expeditions;');
        
        let topAthletes = [];
        if (isRatingEnabledSetting) {
            const athletesRaw = queryDb('SELECT first_name || " " || last_name AS name, points FROM athletes ORDER BY points DESC LIMIT 3;');
            topAthletes = athletesRaw.map((ath, idx) => ({
                position: idx + 1,
                name: ath.name,
                points: ath.points
            }));
        }
        
        const partnershipRaw = queryDb('SELECT * FROM view_partnership_pipeline;');
        const activePartnersCount = partnershipRaw[0] ? partnershipRaw[0].active_partners_count : 0;
        
        const activeSponsors = queryDb('SELECT * FROM view_active_sponsors;');
        
        const summary = {
            warehouse_pulse: {
                overdue_count: warehousePulse.overdue_count,
                overdue_items: overdueItems,
                recent_incidents: warehousePulse.recent_incidents,
                active_gear_outside: warehousePulse.active_gear_outside
            },
            member_analytics: {
                total_active_members: memberAnalytics.total_active_members,
                in_the_mountains: memberAnalytics.in_the_mountains,
                at_base: memberAnalytics.at_base,
                rank_distribution: {
                    beginner: memberAnalytics.beginner,
                    first_rank: memberAnalytics.first_rank,
                    master: memberAnalytics.master
                }
            },
            routes_and_ranking: {
                is_rating_engine_enabled: isRatingEnabledSetting,
                active_expeditions: expeditions,
                top_peaks: ["მყინვარწვერი", "უშბა", "თეთნულდი"],
                top_athletes: topAthletes
            },
            partnership_pipeline: {
                active_sponsors: activeSponsors,
                active_partners_count: activePartnersCount
            }
        };
        
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(summary));
        return;
    }

    // GET /api/v1/notifications
    if (req.url === '/api/v1/notifications' && req.method === 'GET') {
        const overdue = queryDb('SELECT athlete_name, item, days_overdue FROM view_overdue_items;');
        const sponsors = queryDb('SELECT name, days_left FROM view_active_sponsors WHERE days_left >= 0 AND days_left <= 7;');
        
        const notifications = [];
        
        // Critical alerts (overdue items)
        overdue.forEach((row, idx) => {
            notifications.push({
                id: `overdue-${idx}-${row.athlete_name}-${row.item}`.replace(/\s+/g, '-'),
                type: 'critical',
                text: `ყურადღება: ${row.athlete_name}-ის მიერ წაღებული ${row.item}-ის დაბრუნების ვადა გადაცილებულია!`,
                timestamp: Date.now() - idx * 1000
            });
        });
        
        // Warning alerts (sponsors expiring within 7 days)
        sponsors.forEach((row, idx) => {
            notifications.push({
                id: `sponsor-${idx}-${row.name}`.replace(/\s+/g, '-'),
                type: 'warning',
                text: `ყურადღება: ${row.name}-ის სპონსორობის ხელშეკრულებას ვადა ${row.days_left} დღეში ეწურება!`,
                timestamp: Date.now() - (idx + overdue.length) * 1000
            });
        });
        
        // Critical alerts for medical certificate expiry
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const medicalExpiries = queryDb("SELECT id, first_name, last_name, medical_certificate_expiry FROM athletes WHERE medical_certificate_expiry IS NOT NULL AND medical_certificate_expiry != '';");
            
            medicalExpiries.forEach((row, idx) => {
                const expDate = new Date(row.medical_certificate_expiry);
                expDate.setHours(0, 0, 0, 0);
                const diffTime = expDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays <= 7) {
                    notifications.push({
                        id: `medical-expiry-${row.id}-${row.medical_certificate_expiry}`,
                        type: 'critical',
                        text: `ყურადღება: ${row.first_name} ${row.last_name}-ს სამედიცინო ცნობას ვადა ამოეწურა (${row.medical_certificate_expiry}), საჭიროა განახლება!`,
                        timestamp: Date.now() - (idx + overdue.length + sponsors.length) * 1000
                    });
                }
            });
        } catch (e) {
            console.error("Error generating medical expiry notifications:", e);
        }
        
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(notifications));
        return;
    }

    // GET /api/v1/dashboard/sync
    if (req.url === '/api/v1/dashboard/sync' && req.method === 'GET') {
        try {
            const rows = queryDb("SELECT key, value FROM settings;");
            const settings = {};
            rows.forEach(r => {
                settings[r.key] = r.value;
            });
            const ranksVal = (settings['ranksEnabled'] === 'true' || settings['ranks_system_enabled'] === 'true') ? 1 : 0;
            const honoraryVal = (settings['honorary_titles_enabled'] === 'true' || settings['honoraryTitlesEnabled'] === 'true') ? 1 : 0;
            const awardsVal = (settings['awards_enabled'] === 'true' || settings['awardsEnabled'] === 'true') ? 1 : 0;

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                system_settings: {
                    ranks_system_enabled: ranksVal,
                    honorary_titles_enabled: honoraryVal,
                    awards_enabled: awardsVal
                }
            }));
        } catch (err) {
            console.error("GET sync settings error:", err);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // POST /api/v1/dashboard/sync
    if (req.url === '/api/v1/dashboard/sync' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                syncDatabase(data);
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error("Sync error:", err);
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/v1/athletes
    if (req.url === '/api/v1/athletes' && req.method === 'GET') {
        try {
            const athletes = queryDb('SELECT * FROM athletes ORDER BY id DESC;');
            const mapped = athletes.map(a => {
                let achievements = [];
                try {
                    achievements = JSON.parse(a.achievements || '[]');
                } catch (e) {
                    console.error("Error parsing achievements for athlete ID:", a.id, e);
                }
                return {
                    id: a.id,
                    firstName: a.first_name || '',
                    lastName: a.last_name || '',
                    personalId: a.personal_id || '',
                    status: a.status || '',
                    memberSince: a.member_since || '',
                    isFederationMember: a.is_federation_member === 1,
                    isNationalTeamMember: a.is_national_team_member === 1,
                    mountaineerRank: a.mountaineer_rank || 'NONE',
                    locationStatus: a.location_status || 'ბაზაზეა',
                    points: a.points || 0,
                    achievements: achievements,
                    medicalCertificateExpiry: a.medical_certificate_expiry || ''
                };
            });
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(mapped));
        } catch (err) {
            console.error("GET athletes error:", err);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // POST /api/v1/athletes/ranks
    if (req.url === '/api/v1/athletes/ranks' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { athlete_id, sport_type, rank_name, organization, assignment_date } = data;
                
                if (!athlete_id || !rank_name) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Missing athlete_id or rank_name' }));
                    return;
                }

                const id = 'ar-' + Math.random().toString(36).substr(2, 9);
                const sql = `INSERT INTO athlete_ranks (id, athlete_id, sport_type, rank_name, organization, assignment_date) VALUES (` +
                    `'${id}', ` +
                    `'${athlete_id.replace(/'/g, "''")}', ` +
                    `'${(sport_type || '').replace(/'/g, "''")}', ` +
                    `'${rank_name.replace(/'/g, "''")}', ` +
                    `'${(organization || '').replace(/'/g, "''")}', ` +
                    `'${(assignment_date || '').replace(/'/g, "''")}'` +
                    `);`;
                executeSql(sql);

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, id }));
            } catch (err) {
                console.error("Save athlete rank error:", err);
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/v1/settings
    if (req.url === '/api/v1/settings' && req.method === 'GET') {
        const rows = queryDb("SELECT key, value FROM settings;");
        const settings = {};
        rows.forEach(r => {
            if (r.value === 'true') settings[r.key] = true;
            else if (r.value === 'false') settings[r.key] = false;
            else settings[r.key] = r.value;
        });
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(settings));
        return;
    }

    // POST /api/v1/settings
    if (req.url === '/api/v1/settings' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                let sql = 'BEGIN TRANSACTION;\n';
                Object.entries(data).forEach(([k, v]) => {
                    const valStr = typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v);
                    sql += `INSERT OR REPLACE INTO settings (key, value) VALUES ('${k.replace(/'/g, "''")}', '${valStr.replace(/'/g, "''")}');\n`;
                });
                sql += 'COMMIT;\n';
                executeSql(sql);
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/v1/honorary-titles
    if (req.url === '/api/v1/honorary-titles' && req.method === 'GET') {
        const titles = queryDb("SELECT * FROM honorary_titles ORDER BY id ASC;");
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(titles));
        return;
    }

    // POST /api/v1/honorary-titles
    if (req.url === '/api/v1/honorary-titles' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const title_name = data.title_name;
                if (!title_name) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Missing title_name' }));
                    return;
                }
                const sql = `INSERT INTO honorary_titles (title_name) VALUES ('${title_name.replace(/'/g, "''")}');`;
                executeSql(sql);
                const lastInserted = queryDb("SELECT * FROM honorary_titles WHERE rowid = last_insert_rowid();");
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, id: lastInserted[0]?.id }));
            } catch (err) {
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // DELETE /api/v1/honorary-titles
    if (req.url.startsWith('/api/v1/honorary-titles') && req.method === 'DELETE') {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const id = urlObj.searchParams.get('id');
        if (!id) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: 'Missing id parameter' }));
            return;
        }
        executeSql(`DELETE FROM honorary_titles WHERE id = ${parseInt(id) || 0};`);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    // GET /api/v1/federation-awards
    if (req.url === '/api/v1/federation-awards' && req.method === 'GET') {
        const awards = queryDb("SELECT * FROM federation_awards ORDER BY id ASC;");
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(awards));
        return;
    }

    // POST /api/v1/federation-awards
    if (req.url === '/api/v1/federation-awards' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const award_name = data.award_name;
                if (!award_name) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Missing award_name' }));
                    return;
                }
                const sql = `INSERT INTO federation_awards (award_name) VALUES ('${award_name.replace(/'/g, "''")}');`;
                executeSql(sql);
                const lastInserted = queryDb("SELECT * FROM federation_awards WHERE rowid = last_insert_rowid();");
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, id: lastInserted[0]?.id }));
            } catch (err) {
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // DELETE /api/v1/federation-awards
    if (req.url.startsWith('/api/v1/federation-awards') && req.method === 'DELETE') {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const id = urlObj.searchParams.get('id');
        if (!id) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: 'Missing id parameter' }));
            return;
        }
        executeSql(`DELETE FROM federation_awards WHERE id = ${parseInt(id) || 0};`);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ success: true }));
        return;
    }

    // GET /api/v1/calendar
    if (req.url.startsWith('/api/v1/calendar') && req.method === 'GET') {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const dateParam = urlObj.searchParams.get('date');
        let sql = 'SELECT * FROM calendar_events';
        if (dateParam) {
            sql += ` WHERE event_date = '${dateParam.replace(/'/g, "''")}'`;
        }
        sql += ' ORDER BY id ASC;';
        const events = queryDb(sql);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(events));
        return;
    }

    // POST /api/v1/calendar
    if (req.url === '/api/v1/calendar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const event_date = (data.event_date || data.eventDate || '').replace(/'/g, "''");
                const event_title = (data.event_title || data.eventTitle || '').replace(/'/g, "''");
                const event_description = (data.event_description || data.eventDescription || '').replace(/'/g, "''");
                
                if (!event_date || !event_title) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(JSON.stringify({ success: false, error: 'Missing date or title' }));
                    return;
                }

                const sql = `INSERT INTO calendar_events (event_date, event_title, event_description) VALUES ('${event_date}', '${event_title}', '${event_description}');`;
                executeSql(sql);
                
                const lastInserted = queryDb("SELECT * FROM calendar_events WHERE rowid = last_insert_rowid();");
                
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, event: lastInserted[0] }));
            } catch (err) {
                console.error("Save calendar event error:", err);
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Handle File Upload API
    if (req.url.startsWith('/api/upload') && req.method === 'POST') {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const filename = urlObj.searchParams.get('filename') || 'file_' + Date.now();
        const storageDir = path.join(__dirname, 'storage');
        const contractsDir = path.join(storageDir, 'contracts');
        
        try {
            if (!fs.existsSync(storageDir)) {
                fs.mkdirSync(storageDir);
            }
            if (!fs.existsSync(contractsDir)) {
                fs.mkdirSync(contractsDir);
            }
            
            const targetPath = path.join(contractsDir, filename);
            const writeStream = fs.createWriteStream(targetPath);
            
            req.pipe(writeStream);
            
            req.on('end', () => {
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    file_url: `/storage/contracts/${filename}` 
                }));
            });
            
            req.on('error', (err) => {
                console.error("Upload stream error:", err);
                res.writeHead(500);
                res.end('Upload stream error');
            });
        } catch (err) {
            console.error("Upload error:", err);
            res.writeHead(500);
            res.end('Upload exception');
        }
        return;
    }

    // Handle Partnership PUT/PATCH API
    if (req.url.startsWith('/api/partnerships') && (req.method === 'PUT' || req.method === 'PATCH')) {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const id = urlObj.searchParams.get('id');
        
        if (!id) {
            res.writeHead(400, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: 'Missing partnership ID' }));
            return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                
                // Calculate status based on current date (2026-05-24)
                const today = new Date('2026-05-24');
                today.setHours(0, 0, 0, 0);
                const startDate = new Date(data.valid_from);
                const endDate = new Date(data.valid_to);
                const statusVal = (today >= startDate && today <= endDate) ? 'active' : 'inactive';

                const nameEscaped = (data.name || '').replace(/'/g, "''");
                const descEscaped = (data.description || '').replace(/'/g, "''");
                const validFromEscaped = (data.valid_from || '').replace(/'/g, "''");
                const validToEscaped = (data.valid_to || '').replace(/'/g, "''");
                const contractUrlEscaped = data.contract_file_url ? `'${data.contract_file_url.replace(/'/g, "''")}'` : 'NULL';
                const formEscaped = data.partnership_form ? `'${data.partnership_form.replace(/'/g, "''")}'` : 'NULL';

                const sql = `
                    UPDATE partnerships SET
                        name = '${nameEscaped}',
                        description = '${descEscaped}',
                        start_date = '${validFromEscaped}',
                        end_date = '${validToEscaped}',
                        contract_file_url = ${contractUrlEscaped},
                        partnership_form = ${formEscaped},
                        status = '${statusVal}'
                    WHERE id = '${id.replace(/'/g, "''")}';
                `;
                
                executeSql(sql);
                
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    partnership: {
                        partnership_id: id,
                        type: data.type,
                        name: data.name,
                        valid_from: data.valid_from,
                        valid_to: data.valid_to,
                        description: data.description,
                        contract_file_url: data.contract_file_url,
                        partnership_form: data.partnership_form,
                        status: statusVal
                    }
                }));
            } catch (err) {
                console.error("Partnership update error:", err);
                res.writeHead(400, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/mentors
    if (req.url === '/api/mentors' && req.method === 'GET') {
        const mentors = queryDb('SELECT * FROM mentors;');
        const mapped = mentors.map(m => ({
            id: m.id,
            status: m.status,
            firstName: m.first_name,
            lastName: m.last_name,
            personalId: m.personal_id,
            birthDate: m.birth_date,
            gender: m.gender,
            nationality: m.nationality,
            phone: m.phone,
            email: m.email,
            address: m.address,
            height: m.height,
            weight: m.weight,
            bloodType: m.blood_type,
            sportTypes: m.sport_types ? m.sport_types.split(',') : [],
            sportType: m.sport_types ? m.sport_types.split(',')[0] : '',
            category: m.category,
            biography: m.biography,
            photo: m.photo,
            certificates: [],
            awards: []
        }));
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(mapped));
        return;
    }

    // POST /api/mentors
    if (req.url === '/api/mentors' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const id = data.id || 'M-' + Date.now();
                const status = (data.status || '').replace(/'/g, "''");
                const first_name = (data.firstName || '').replace(/'/g, "''");
                const last_name = (data.lastName || '').replace(/'/g, "''");
                const personal_id = (data.personalId || '').replace(/'/g, "''");
                const birth_date = (data.birthDate || '').replace(/'/g, "''");
                const gender = (data.gender || '').replace(/'/g, "''");
                const nationality = (data.nationality || '').replace(/'/g, "''");
                const phone = (data.phone || '').replace(/'/g, "''");
                const email = (data.email || '').replace(/'/g, "''");
                const address = (data.address || '').replace(/'/g, "''");
                const height = parseInt(data.height) || 0;
                const weight = parseInt(data.weight) || 0;
                const blood_type = (data.bloodType || '').replace(/'/g, "''");
                const sport_types = (Array.isArray(data.sportTypes) ? data.sportTypes.join(',') : '').replace(/'/g, "''");
                const category = (data.category || '').replace(/'/g, "''");
                const biography = (data.biography || '').replace(/'/g, "''");
                const photo = (data.photo || '').replace(/'/g, "''");

                const sql = `INSERT OR REPLACE INTO mentors (id, status, first_name, last_name, personal_id, birth_date, gender, nationality, phone, email, address, height, weight, blood_type, sport_types, category, biography, photo) VALUES (` +
                    `'${id}', '${status}', '${first_name}', '${last_name}', '${personal_id}', '${birth_date}', '${gender}', '${nationality}', '${phone}', '${email}', '${address}', ${height}, ${weight}, '${blood_type}', '${sport_types}', '${category}', '${biography}', '${photo}'` +
                    `);`;
                executeSql(sql);
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, id }));
            } catch (err) {
                console.error("Save mentor error:", err);
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // GET /api/v1/warehouse/invoice
    if (req.url.startsWith('/api/v1/warehouse/invoice') && req.method === 'GET') {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const id = urlObj.searchParams.get('id');
        
        if (!id) {
            res.writeHead(400, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: 'Missing transaction ID' }));
            return;
        }

        const transactionIdEscaped = id.replace(/'/g, "''");
        const sql = `
            SELECT 
                t.id, 
                t.type, 
                t.item_id AS itemId, 
                t.item_name AS itemName, 
                t.athlete_id AS athleteId, 
                t.athlete_name AS athleteName, 
                t.issue_date AS issueDate, 
                t.expected_return_date AS expectedReturnDate, 
                t.status, 
                t.qty, 
                t.expedition_name AS expeditionName,
                t.components,
                t.item_code AS itemCode,
                e.event_title AS eventTitle,
                e.event_date AS eventDate
            FROM warehouse_transactions t
            LEFT JOIN calendar_events e ON (t.issue_date = e.event_date OR t.expedition_name = e.event_title)
            WHERE t.id = '${transactionIdEscaped}'
            LIMIT 1;
        `;
        
        const results = queryDb(sql);
        
        if (results.length === 0) {
            res.writeHead(404, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: false, error: 'Transaction not found' }));
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(results[0]));
        return;
    }

    let filePath = '.' + req.url.split('?')[0];
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js':
        case '.jsx':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    if (extname === '.jsx') {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error: ' + err.code);
                }
                return;
            }
            const mtime = stats.mtimeMs;
            const cached = compiledCache.get(filePath);
            if (cached && cached.mtime === mtime) {
                res.writeHead(200, { 
                    'Content-Type': 'text/javascript',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                });
                res.end(cached.code, 'utf-8');
                return;
            }

            fs.readFile(filePath, 'utf8', (readErr, content) => {
                if (readErr) {
                    res.writeHead(500);
                    res.end('Server error reading file');
                    return;
                }
                try {
                    const Babel = require('./scratch/babel.min.js');
                    const compiled = Babel.transform(content, {
                        presets: ['react'],
                        filename: path.basename(filePath)
                    }).code;
                    compiledCache.set(filePath, { mtime, code: compiled });
                    res.writeHead(200, { 
                        'Content-Type': 'text/javascript',
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    });
                    res.end(compiled, 'utf-8');
                } catch (compileErr) {
                    console.error("Transpilation error for", filePath, compileErr);
                    res.writeHead(500);
                    res.end('Compilation error: ' + compileErr.message);
                }
            });
        });
        return;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT'){
                res.writeHead(404);
                res.end('File not found');
            }
            else {
                res.writeHead(500);
                res.end('Server error: '+error.code);
            }
        }
        else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
}).listen(PORT);

console.log(`Server running at http://localhost:${PORT}/`);
