import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Clock, Play, X, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import './UploadPage.css';

const UploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }

      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
      setUploadComplete(false);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !videoTitle.trim()) {
      alert('Please select a video and add a title');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Real upload to backend
      await apiService.uploadVideo(
        selectedFile,
        videoTitle,
        videoDescription,
        'demo_user' // In real app, get from auth
      );

      setUploadProgress(100);
      setIsUploading(false);
      setUploadComplete(true);
      setUploadSuccess(true);

      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setVideoTitle('');
        setVideoDescription('');
        setUploadComplete(false);
        setUploadSuccess(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadComplete(false);
    setUploadSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <motion.div 
          className="upload-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Upload Your Dog Walk Video</h1>
          <p>Capture the atmosphere and vibe of your location through a 30-second dog walk video</p>
          
          {/* 30 Second Limit Notice */}
          <div className="video-limit-banner">
            <Clock size={24} />
            <div className="limit-content">
              <h3>30-Second Video Limit</h3>
              <p>Keep your videos short and engaging! Videos must be 30 seconds or shorter to be eligible for prizes.</p>
            </div>
          </div>
        </motion.div>

        <div className="upload-content">
          {/* Upload Area */}
          <motion.div 
            className="upload-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {!selectedFile ? (
              <div 
                className="upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={48} />
                <h3>Click to upload or drag and drop</h3>
                <p>MP4, MOV, AVI up to 50MB</p>
                <span className="upload-hint">Maximum 30 seconds</span>
              </div>
            ) : (
              <div className="selected-file">
                <div className="file-preview">
                  <Play size={32} />
                  <span>{selectedFile.name}</span>
                </div>
                <button className="remove-btn" onClick={removeFile}>
                  <X size={20} />
                </button>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </motion.div>

          {/* Video Details Form */}
          {selectedFile && (
            <motion.div 
              className="video-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Video Details</h3>
              
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Give your video a catchy title..."
                  maxLength={100}
                />
                <span className="char-count">{videoTitle.length}/100</span>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Tell us about your dog's walk..."
                  maxLength={500}
                  rows={3}
                />
                <span className="char-count">{videoDescription.length}/500</span>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span>{uploadProgress}% uploaded</span>
                </div>
              )}

              {/* Upload Success Message */}
              {uploadComplete && uploadSuccess && (
                <motion.div 
                  className="upload-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="success-message">
                    <CheckCircle size={24} />
                    <div className="message-info">
                      <span className="message-label">Upload Successful!</span>
                      <span className="message-value">Your video is now live</span>
                    </div>
                  </div>
                  <p className="success-feedback">
                    Great job! Your video has been uploaded and is now visible to the global community. 
                    Share the unique atmosphere of your location with dog lovers around the world!
                  </p>
                </motion.div>
              )}

              {/* Upload Button */}
              <button 
                className={`upload-btn ${!selectedFile || !videoTitle.trim() || isUploading ? 'disabled' : ''}`}
                onClick={handleUpload}
                disabled={!selectedFile || !videoTitle.trim() || isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="spinner" />
                    Uploading...
                  </>
                ) : uploadComplete ? (
                  <>
                    <CheckCircle size={20} />
                    Upload Complete!
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Video
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 