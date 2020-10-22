import React, { useEffect, useState } from "react";
import "./App.css";
import { db, auth } from "./firebase";
import Post from "./Post";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Avatar, Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "none",
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, username]);

  useEffect(() => {
    // snapshot meaning anything added modified or deleted in docs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);

  const handleSignup = (event) => {
    event.preventDefault();

    if (username.trim().length === 0) {
      setError("The username is required.");
      return;
    } else if (email.trim().length === 0) {
      setError("The email is required.");
      return;
    } else if (password.trim().length < 6) {
      setError("The password must be of atleast 6 characters long.");
      return;
    } else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          setOpen(false);
          return authUser.user.updateProfile({ displayName: username });
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  // login

  const handleLogin = (event) => {
    event.preventDefault();
    if (email.trim().length === 0) {
      setError("The email is required.");
      return;
    } else if (password.trim().length === 0) {
      setError("The password is required.");
      return;
    } else {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((authUser) => {
          setUser(authUser);
          setOpenSignIn(false);
        })
        .catch((error) => setError(error.message));
    }
  };

  const handleFormReset = () => {
    setUser("");
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <div className="app">
      {/* sign up */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" onSubmit={handleSignup}>
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="app__error">{error}</p>}

            <Button type="submit" color="primary">
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      {/* sign in */}

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup" onSubmit={handleLogin}>
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="app__error">{error}</p>}

            <Button type="submit" color="primary">
              Log in
            </Button>
          </form>
        </div>
      </Modal>

      <header className="app__headerContainer">
        <div className="app__header">
          <img
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />

          <div className="app__headerAuth">
            {user ? (
              <div className="app_loginContainer">
                <Avatar alt={user.displayName} src="/static/" /> &nbsp;
                <Button onClick={() => auth.signOut()}>Logout</Button>
              </div>
            ) : (
              <React.Fragment>
                <Button
                  onClick={() => {
                    handleFormReset();
                    setOpenSignIn(true);
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => {
                    handleFormReset();
                    setOpen(true);
                  }}
                >
                  Sign up
                </Button>
              </React.Fragment>
            )}
          </div>
        </div>
      </header>

      <div className="app__container">
        {user ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <p
            style={{
              marginBottom: "15px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Sorry, you need to login to post.
          </p>
        )}

        {posts.length === 0 && (
          <p className="app__noPost">There is no post yet!</p>
        )}

        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
            loggedInUser={user}
          />
        ))}
      </div>
      <footer className="app__footer">
        Developed with <span style={{ color: "red" }}>&#9829;</span> by Inderjit
        Singh
      </footer>
    </div>
  );
}

export default App;
