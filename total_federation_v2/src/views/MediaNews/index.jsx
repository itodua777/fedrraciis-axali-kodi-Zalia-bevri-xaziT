import React from 'react';
import NewsPublicationForm from './components/NewsPublicationForm.jsx';
import MediaLibrary from './components/MediaLibrary.jsx';

const MediaNewsDashboard = () => {
  const [selectedAsset, setSelectedAsset] = React.useState(null);
  const [newsData, setNewsData] = React.useState({
    title: '',
    content: '',
    category: 'სიახლე',
    tags: [],
    status: 'Draft',
    thumbnail: null,
    thumbnailUrl: '',
    publish_at: ''
  });
  const [tagInput, setTagInput] = React.useState('');

  const mockAssets = [
    { id: 1, name: "ყაზბეგი_ექსპედიცია_2026_ბანაკი_3", type: "image", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80", album: "სამთო მომზადება", tags: "#მწვერვალი, #თოკი" },
    { id: 2, name: "შეხვედრა_მინისტრთან", type: "image", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=400&q=80", album: "ოფიციალური შეხვედრები", tags: "" }
  ];

  const [assets, setAssets] = React.useState(mockAssets);
  const [albums, setAlbums] = React.useState(["სამთო მომზადება", "ოფიციალური შეხვედრები"]);
  const [selectedAlbum, setSelectedAlbum] = React.useState("სამთო მომზადება");
  const [newAlbumName, setNewAlbumName] = React.useState("");
  const [isCreatingAlbum, setIsCreatingAlbum] = React.useState(false);

  const containerStyle = {
    flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0",
    fontFamily: "sans-serif", overflowY: "auto", display: "flex", gap: "20px"
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag) {
        const formattedTag = tag.startsWith('#') ? tag : '#' + tag;
        if (!newsData.tags.includes(formattedTag)) {
          setNewsData(prev => ({
            ...prev,
            tags: [...prev.tags, formattedTag]
          }));
        }
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewsData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewsData(prev => ({
          ...prev,
          thumbnail: file,
          thumbnailUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaUpload = (filesList) => {
    const newAssets = [];
    Array.from(filesList).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newAssets.push({
          id: Date.now() + index,
          name: file.name.split('.').slice(0, -1).join('.') || file.name,
          type: "image",
          url: url,
          album: selectedAlbum,
          tags: ""
        });
      }
    });
    if (newAssets.length > 0) {
      setAssets(prev => [...newAssets, ...prev]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "var(--color-emerald-core)";
    e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 5%, transparent)";
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 30%, transparent)";
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 30%, transparent)";
    e.currentTarget.style.backgroundColor = "transparent";
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMediaUpload(e.dataTransfer.files);
    }
  };

  const handleSubmitNews = () => {
    if (!newsData.title.trim()) {
      alert("გთხოვთ შეიყვანოთ სათაური.");
      return;
    }
    if (newsData.status === 'Scheduled' && !newsData.publish_at) {
      alert("გთხოვთ მიუთითოთ გამოქვეყნების დრო დაგეგმილი სტატუსისთვის.");
      return;
    }

    const details = {
      title: newsData.title,
      content: newsData.content,
      category: newsData.category,
      tags: newsData.tags,
      status: newsData.status,
      publish_at: newsData.status === 'Scheduled' ? newsData.publish_at : null,
      thumbnailName: newsData.thumbnail ? newsData.thumbnail.name : 'ნაგულისხმევი ფოტო'
    };

    const popupContent = `
      სიახლე წარმატებით განთავსდა ბაზაში!
      -------------------------------------
      კატეგორია: ${details.category}
      სათაური: ${details.title}
      სტატუსი: ${details.status}
      ${details.publish_at ? `დაგეგმილი დრო (publish_at): ${details.publish_at.replace('T', ' ')}` : ''}
      თეგები: ${details.tags.join(', ') || 'არ არის'}
      თამბნეილი: ${details.thumbnailName}
    `;
    alert(popupContent);
    console.log("ბექენდში შენახული მონაცემები (publish_at-ით):", details);
  };

  return (
    <div style={containerStyle}>
      <NewsPublicationForm
        newsData={newsData}
        setNewsData={setNewsData}
        tagInput={tagInput}
        setTagInput={setTagInput}
        handleTagKeyDown={handleTagKeyDown}
        removeTag={removeTag}
        handleThumbnailChange={handleThumbnailChange}
        handleSubmitNews={handleSubmitNews}
      />
      <MediaLibrary
        assets={assets}
        setAssets={setAssets}
        albums={albums}
        setAlbums={setAlbums}
        selectedAlbum={selectedAlbum}
        setSelectedAlbum={setSelectedAlbum}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        newAlbumName={newAlbumName}
        setNewAlbumName={setNewAlbumName}
        isCreatingAlbum={isCreatingAlbum}
        setIsCreatingAlbum={setIsCreatingAlbum}
        handleMediaUpload={handleMediaUpload}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
      />
    </div>
  );
};

export default MediaNewsDashboard;
