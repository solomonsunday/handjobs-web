import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { formatter } from "../../helpers/converter";
import { openModal } from "store/modules/modal";
import {
  deletePost,
  likePost,
  likePostAsync,
  postLiked,
} from "../../store/modules/timeline";
import { loadComments } from "../../store/modules/comment";
import { TIMELINE } from "constants/timeline";
import agent from "../../services/agent.service";
import moment from "moment";
import ThumbsDown from "../../components/ThumbDown";
import ThumbsUp from "../../components/ThumbUp";
import "./Timeline.css";

import "./Timeline.css";
import { ACCOUNT_TYPE } from "constants/accountType";
import { Link } from "react-router-dom";
import { MEDIATYPES } from "constants/setup";
import AppLoading from "components/AppLoading";
import Spinner from "components/spinner/spinner.component";
import { showMessage } from "store/modules/notification";
import { MESSAGE_TYPE } from "store/constant";
const Post = ({
  profileInfo,
  post,
  isAuthenticated,
  expandProfileImage,
  onShow,
  commentCount,
  setImageToDisplay,
  viewPage = false,
}) => {
  const [likeLoading, setLikeLoading] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.timeline.loadingPosts);
  const loadingStatus = useSelector((state) => state.timeline.loadingStatus);
  const [copyAlert, setCopyAlert] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const isCorporate =
    post?.author?.accountType === ACCOUNT_TYPE.CORPORATE ? true : false;
  const postId = post?.id;

  console.log({ loadingStatus, loading });

  const expandPostImage = (e) => {
    setImageToDisplay(e.target.src);
    dispatch(openModal(TIMELINE.POSTIMAGE));
  };

  const handleLike = async (e) => {
    setLikeLoading(true);
    const postId = e.currentTarget.dataset.id;
    try {
      const response = await likePostAsync(postId);

      dispatch(
        showMessage({
          type: MESSAGE_TYPE.SUCCESS,
          title: "Like Post",
          message: "Post liked!!",
        })
      );
      dispatch(postLiked(response));
    } catch (error) {
      dispatch(showMessage({ type: "error", message: error }));
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShareButton = (e) => {
    const postId = e.currentTarget.dataset.id;
    const el = document.createElement("input");
    el.value = window.location.host + `/post/${postId}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopyAlert(postId);
    setTimeout(function () {
      setCopyAlert(false);
    }, 1000);
  };

  const handleViewComments = (postId, commentPage, pageLimit, loadingType) => {
    dispatch(loadComments(postId, commentPage, pageLimit, loadingType));
  };

  const showComment = (postId) => {
    postId === currentPostId
      ? setCurrentPostId(null)
      : setCurrentPostId(postId);
  };

  return (
    <div className="p-card p-py-3 p-py-sm-5 p-pl-3 p-pl-sm-5 p-pr-4 p-pr-sm-6 p-mb-2 timeline-posts">
      <span className="d-flex justify-content-between">
        <span className="d-flex">
          {post?.author?.imageUrl ? (
            <img
              width="40"
              height="40"
              src={`${post.author.imageUrl}`}
              alt={
                !isCorporate
                  ? formatter.capitalizeFirstLetter(post.author.firstName)
                  : formatter.capitalizeFirstLetter(post.author.companyName)
              }
              className="rounded-circle p-mt-2 p-mb-2 p-mr-sm-3 p-mr-0 profile-picture-timeline text-white"
              onClick={(e) => expandProfileImage(e.target.src)}
            />
          ) : (
            <i className="pi pi-user p-mt-2 p-mb-2 p-mr-sm-3 p-mr-2 timeline-emptyProfilePic-medium"></i>
          )}
          <span>
            <>
              {!isCorporate ? (
                <span className="p-card-title cardtitle-posts p-mb-0">
                  {`${formatter.capitalizeFirstLetter(
                    post?.author?.firstName
                  )} ${formatter.capitalizeFirstLetter(
                    post?.author?.lastName
                  )}`}
                </span>
              ) : (
                isCorporate &&
                post?.author?.companyName && (
                  <span className="p-card-title cardtitle-posts p-mb-0">
                    {formatter.capitalizeFirstLetter(post?.author?.companyName)}
                  </span>
                )
              )}
            </>
            {/* {
              post.author.accountType === ACCOUNT_TYPE.ARTISAN &&
              <span className="stars p-ml-1 align-text-bottom" style={{ "--rating": post.author.rating }} />
            } */}
            <div className="poster-description">
              <p></p>
              {!isCorporate && (
                <>
                  <i className="pi pi-briefcase p-pr-1" />
                  <span> {post?.author?.profession}</span>
                </>
              )}

              <>
                <i className="pi pi-map-marker p-pl-2 p-pr-1" />
                <span>{post?.author?.city && post?.author?.city}</span>
              </>
            </div>
          </span>
        </span>
        {
          <div className="dropdown font-weight-bold ml-2">
            {post.createdBy === agent.Auth.current()?.email && (
              <>
                <i
                  type="button"
                  className="pi pi-ellipsis-v"
                  role="button"
                  data-bs-toggle="dropdown"
                  id="dropdownMenuLink"
                  aria-expanded="false"
                />
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  {/* <li
                    className="dropdown-item timeline-dropdownItem"
                    onClick={() => onShow(post.id)}
                  >
                    Edit
                  </li> */}
                  <li
                    className="dropdown-item timeline-dropdownItem"
                    data-id={post.id}
                    onClick={(e) =>
                      dispatch(deletePost(e.currentTarget.dataset.id))
                    }
                  >
                    Delete
                  </li>
                </ul>
              </>
            )}
            {viewPage && (
              <Link to={"/posts"} className="text-dark">
                {" "}
                back
              </Link>
            )}
          </div>
        }
      </span>
      <h6
        className="p-my-2 d-flex align-center justify-content-between"
        style={{ fontSize: "0.9rem" }}
      >
        <Link to={"/post/" + post.id}> {post.title}</Link>
        <span className="timeline-cardtitle-posttime">
          <i className="pi pi-clock p-pr-1 p-mt-2" />
          <span>{moment(post.createdAt).fromNow("MMMM Do YYYY")} ago</span>
        </span>
      </h6>
      <div className="p-my-2 w-100 h-100">
        <div
          className="p-mb-1"
          style={{ fontSize: "0.9rem" }}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
        {post?.postMedia?.length > 0 &&
          post?.postMedia.map((media) => (
            <>
              {media?.mediaType?.toLowerCase() ==
                MEDIATYPES.IMAGE.toLowerCase() && (
                <img
                  width="80%"
                  alt={post.title}
                  className="timeline-postImage text-white"
                  src={`${media.url}`}
                  onClick={expandPostImage}
                />
              )}

              {media?.mediaType?.toLowerCase() ==
                MEDIATYPES.VIDEO.toLowerCase() && (
                <video wwidth="80%" height="240" controls>
                  <source src={media?.url} type="video/mp4" />
                  <source src={media?.url} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          ))}
      </div>
      <div className="cardtitle-statusbar-timeline p-my-3 p-py-2">
        {
          <div className="d-flex">
            {isAuthenticated ? (
              <span
                data-id={post.id}
                onClick={(e) => handleLike(e)}
                className="post-statusbar-content p-pr-2 align-items-start"
              >
                {likeLoading ? (
                  <Spinner style={{ width: "1px", height: "50px" }} />
                ) : (
                  <ThumbsUp
                    width="23"
                    height="23"
                    liked={false}
                    className="p-mr-1"
                  />
                )}

                {post.likes > 0 && <h6 className="p-pr-1">{post.likes}</h6>}
              </span>
            ) : (
              <p className="p-pr-2">
                {post.likes > 0 && (
                  <>{`${post.likes} ${post.likes > 1 ? "likes" : "like"}`}</>
                )}
              </p>
            )}
          </div>
        }
        <div
          className="timeline-postShare-button"
          data-id={post.id}
          onClick={() => showComment(post.id)}
        >
          <span className="p-button-label">Comment</span>
        </div>

        <div
          className="timeline-postShare-button"
          data-id={post.id}
          onClick={handleShareButton}
        >
          <span className="p-button-label">
            <i className="pi pi-share-alt p-mr-1" />
            Share
          </span>
        </div>
        <span
          className={
            copyAlert === post.id
              ? "timeline-copyModalAlert--active"
              : "timeline-copyModalAlert"
          }
        >
          Link copied
        </span>
      </div>
      {isAuthenticated && currentPostId == post.id && (
        <CommentForm
          postId={post.id}
          imageUrl={profileInfo?.imageUrl}
          expandProfileImage={(e) => expandProfileImage(e.target.src)}
        />
      )}
      {loading !== "loadMore" && (
        <CommentList
          postId={postId}
          onViewComments={handleViewComments}
          commentCount={commentCount}
          expandProfileImage={(e) => expandProfileImage(e.target.src)}
        />
      )}
    </div>
  );
};

export default Post;
