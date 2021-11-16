import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import LoadingComponent from "../../components/Loading/Loading";
import { getUserData } from "../../service/user/user.service";
import axios from "axios";
import { sendUser } from "../../utils/consts";

function compareUsers(user1, user2) {
  return user1.username === user2.username;
}

function SingleUser(props) {
  console.log("props:", props);
  const { username } = useParams();
  const [currentUserFromPage, setCurrentUserFromPage] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getUserData(username)
      .then((axiosData) => {
        if (!axiosData.success) {
          return setError(axiosData.data);
        }
        const theInfoBackFromDb = axiosData.data;
        setCurrentUserFromPage(theInfoBackFromDb.user);
        setPosts(theInfoBackFromDb.posts);
      })

      .finally(() => {
        setLoading(false);
      });
  }, []);

  function follow() {
    axios
      .post(
        "http://localhost:5005/api/user/follow",
        {
          target: currentUserFromPage._id,
        },
        sendUser()
      )
      .then((afterUpdate) => {
        const { data } = afterUpdate;
        props.authenticate(data.user);
      });
  }

  function unfollow() {
    axios
      .post(
        "http://localhost:5005/api/user/unfollow",
        {
          target: currentUserFromPage._id,
        },
        sendUser()
      )
      .then((afterUpdate) => {
        const { data } = afterUpdate;
        props.authenticate(data.user);
      });
  }

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <h2>{error}</h2>;
  }
  const isSameUser = currentUserFromPage.username === props.user?.username;

  const isFollowing = props.user?.following.includes(currentUserFromPage._id);

  return (
    <div>
      <h1>You arrived at your destination {currentUserFromPage.username}</h1>
      {isSameUser ? null : (
        <button onClick={isFollowing ? unfollow : follow}>
          Follow{isFollowing && "ing"}
        </button>
      )}
      <hr />
      {posts.map((post) => {
        return (
          <Link key={post._id} to={`/post/${post._id}`}>
            <img height="200" src={post.image} alt="Grid" />
          </Link>
        );
      })}
    </div>
  );
}

export default SingleUser;
//   function followToggle() {
//     const finalEndpoint = isFollowing ? "follow" : "unfollow";
//     axios.post(
//       `http://localhost:5005/api/user/${finalEndpoint}`,
//       {
//         target: currentUserFromPage._id,
//       },
//       sendUser()
//     );
//   }