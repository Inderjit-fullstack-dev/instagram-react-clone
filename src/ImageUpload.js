import React, { useRef, useState } from "react";
import "./ImageUpload.css";
import { Button, Input } from "@material-ui/core";
import { db, storage } from "./firebase";
import firebase from "firebase";
const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const imageInputRef = useRef();

  const handleChange = (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (caption.trim().length === 0) {
      setError("The caption is required for the image.");
      return;
    } else if (image === null) {
      setError("The image is required.");
      return;
    } else {
      // we are good to go
      const uploadTask = storage.ref(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(progress);
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: username,
              });
            });
          setProgress(0);
          setCaption("");
          setImage(null);
          imageInputRef.current.value = "";
          setError("");
        }
      );
    }
  };

  return (
    <React.Fragment>
      <div className="post__container">
        <Input
          className="post__input"
          type="text"
          placeholder="What's your caption..."
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
        />
        <input
          className="post__file"
          ref={imageInputRef}
          type="file"
          onChange={handleChange}
        />

        <p>{progress !== 0 && <progress max="100" value={progress} />}</p>

        {error && <p className="app__error">{error}</p>}

        <Button
          className="app__btn"
          onClick={handleUpload}
          variant="contained"
          color="primary"
        >
          Upload
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ImageUpload;
