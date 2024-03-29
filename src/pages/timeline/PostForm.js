import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { formatter } from '../../helpers/converter';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { Emoji } from 'emoji-mart'
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { createPost, editPost } from "store/modules/timeline";
import "./Timeline.css";
import { ACCOUNT_TYPE } from 'constants/accountType';
import { MEDIATYPES } from 'constants/setup';

const CreatePostModal = ({ post, clearModalInput }) => {
  const dispatch = useDispatch();
  // const post = useSelector(state => state.timeline.postByPostId);
  const postActionStatus = useSelector(state => state.timeline.loadingPosts);
  const profileInfo = useSelector((state) => state.account.profileInfo);
  const [postObject, setPostObject] = useState({});
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [mediaType, setMediaType] = useState("");
  const [_quill, setQuill] = useState(null);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const { register, handleSubmit, formState: { errors }, setValue } = useForm("");
  const [selectedViewerGroup, setSelectedViewerGroup] = useState({ name: 'Any one', code: 'PBC' });
  const baseClassName = isEmojiOpen ? "TextEditor-actions-emoji-picker-timeline--open" : "TextEditor-actions-emoji-picker-timeline"
  const viewerGroups = [
    { name: 'Any one', code: 'PBC' },
    { name: 'My connections only', code: 'CON' }
  ];

  const onViewerGroupChange = (e) => {
    setSelectedViewerGroup(e.value);
  };

  useEffect(() => {
    window.addEventListener('click', _handleClickEvent);
  }, [])

  useEffect(() => {
    if (postActionStatus === "postSuccess") {
      clearModalInput();
    }
  }, [postActionStatus])

  useEffect(() => {
    if (Object.keys(post).length > 0) {
      setValue("title", post.title);
      setValue("body", post.body);
      if (post.postImage) {
        const imageurl = post.postImage
        setImage({
          preview: imageurl,
          raw: post.postImage
        });
      }
      setPostObject({ title: post.title, body: post.body });
    }
    else {
      setPostObject({});
    }
  }, [post]);

  const handleVideoChange = e => {
    const files = e.target.files;
    for (let i = 0; i <= files.length - 1; i++) {
      let fsize = files.item(i).size;
      let file = Math.round((fsize / 1024));
      // The size of the file.
      if (file >= 5120) {
        alert("Video too big, please select a video less than 5mb");
        return;
      }
    }
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
    setMediaType(MEDIATYPES.VIDEO);
  };


  const handleImageChange = e => {
    const files = e.target.files;
    for (let i = 0; i <= files.length - 1; i++) {
      let fsize = files.item(i).size;
      let file = Math.round((fsize / 1024));
      // The size of the file.
      if (file >= 1024) {
        alert("Image too big, please select a file less than 1mb");
        return;
      }
    }

    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0]
      });
    }
    setMediaType(MEDIATYPES.IMAGE);
  };

  // EmojiPicker
  const _handleQuillLoad = (quill) => {
    setQuill(quill);
  }

  const _handleClickEvent = (e) => {
    const { target } = e;
    const parentIds = ['TextEditor-actions-emoji-button', 'TextEditor-actions-emoji-picker'];

    // Check if the target element is a decendant of any of the above parent IDs
    const isDescendant = parentIds.some((parentId) => isDescendantElement(target, parentId));

    // If element is not a descendant, then close the picker
    if (!isDescendant) {
      _handleEmojiToggle(false);
    }
  }

  const isDescendantElement = (el, parentId) => {
    let isDescendant = false;

    if (el.id === parentId) {
      isDescendant = true;
    }

    while (el = el.parentNode) {
      if (el.id === parentId) {
        isDescendant = true;
      }
    }

    return isDescendant;
  }

  const _handleEmojiToggle = (state) => {
    if (isEmojiOpen) {
      setIsEmojiOpen(false)
    }
    else {
      setIsEmojiOpen(state)
    };
  }


  const handleEmojiSelect = (e) => {
    const range = _quill.getSelection({ focus: false });
    let sym = e.unified.split('-')
    let codesArray = []
    sym.forEach(el => codesArray.push('0x' + el))
    let emoji = String.fromCodePoint(...codesArray)
    if (range) {
      if (range.length === 0) {
        _quill.insertText(range.index, emoji);
      } else {
        // If cursor position is a selection, then delete the selection and insert emoji at the start index.
        _quill.deleteText(range.index, range.length);
        _quill.insertText(range.index, emoji);
      }
    }
    // Close picker after making a selection
    _handleEmojiToggle(false);
  }
  // EmojiPicker

  const deleteMediaItem = (e) => {
    setImage({ preview: "", raw: "" });
  };

  const inputChange = (e, inputName) => {

    const inputValue =
      inputName && (inputName === "body")
        ? e.htmlValue
        : e.target.value
    const updatedPostObject = Object.assign({}, postObject);
    updatedPostObject[inputName] = inputValue;
    setValue(inputName, inputValue, { shouldValidate: true });
    //setPostObject({ ...postObject, ...updatedPostObject });
  };

  const validateEditorBody = (value) => {
    const quilText = _quill.getText().trim().length;
    return quilText || " Post content is required";
  }

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("mediaType", mediaType);
    if (image.raw) {
      formData.append("files", image.raw)
    };
    if (Object.keys(post).length > 0) {
      dispatch(editPost(post.id, formData));
    }
    else {
      dispatch(createPost(formData));
    }
  }

  // Text editor header
  const renderHeader = () => {
    return (
      <span className="ql-formats text-editor-timeline">

        <select className="ql-font"></select>
        <select className="ql-size"></select>


        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>


        <select className="ql-color"></select>
        <select className="ql-background"></select>


        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>


        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>


        <button className="ql-direction" value="rtl"></button>
        <select className="ql-align"></select>

        <button className="ql-link"></button>
        <button className="ql-formula"></button>

        <button className="ql-clean"></button>
        <span
          id="TextEditor-actions-emoji-button"
          onClick={() => _handleEmojiToggle(true)}
        >
          <Emoji
            emoji={{ id: 'slightly_smiling_face' }}
            size={20}
          />
        </span>
        <div
          id="TextEditor-actions-emoji-picker"
          className={baseClassName}
        >
          <Picker
            showPreview={false}
            showSkinTones={false}
            onSelect={(emoji) => handleEmojiSelect(emoji)}
            exclude={["flags", "recent"]}
            skin={1}
          />
        </div>
      </span>
    );
  }
  const header = renderHeader();
  // Text editor header


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex align-items-center">
          <img
            width="50"
            height="50"
            alt="Profile"
            src={profileInfo?.imageUrl}
            className="rounded-circle profile-picture-timeline"
          />
          <span className="p-ml-2">
            {
              profileInfo?.accountType === ACCOUNT_TYPE.CORPORATE ?
                <h6>
                  {formatter.capitalizeFirstLetter(profileInfo?.companyName)}
                </h6>
                :
                <h6>
                  {`${formatter.capitalizeFirstLetter(profileInfo?.firstName)} ${formatter.capitalizeFirstLetter(profileInfo?.lastName)}`}
                </h6>
            }
            <div>
              {/* <Dropdown
                value={selectedViewerGroup}
                options={viewerGroups}
                onChange={onViewerGroupChange}
                optionLabel="name"
                className="viewerGroups-dropdown" /> */}
            </div>
          </span>
        </div>
        <div className="p-mt-3">
          <label htmlFor="title">
            <div className="createPostModal-title">
              Title *
              {
                errors.title &&
                <small className="text-danger font-weight-bold">
                  {errors.title.message}
                </small>
              }
            </div>
          </label>
        </div>
        <InputTextarea
          rows={1}
          cols={30}
          name="title"
          autoResize id="title"
          defaultValue={postObject.title}
          className="timelineModal-Input w-50"
          {...register("title",
            {
              validate: (value) => !!value.trim() || " Title is required"
            }
          )}
          onChange={(e) => { inputChange(e, "title") }
          }
        />
        <div>
          <label htmlFor="body">
            <div className="createPostModal-title p-mt-2">
              Body *
              {
                errors.body &&
                <small className="text-danger font-weight-bold">
                  {errors.body.message}
                </small>
              }
            </div>
          </label>
        </div>
        <div className="timelineModal-Input p-p-2">
          <Editor
            style={{ height: '320px' }}
            value={postObject.body}
            headerTemplate={header}
            onLoad={_handleQuillLoad}
            className="TextEditor-container-timeline"
            onTextChange={(e) => { inputChange(e, "body") }}
            {...register("body", {
              validate: (e) => { validateEditorBody(e) }
            })}
            id="body"
            name="body"
          />
          <div className="d-flex justify-content-end align-items-center p-mt-3">
            <h6 className="p-mr-1">
              Add:
            </h6>
            <input
              type="file"
              id="timeline-uploadPhoto"
              style={{ display: "none" }}
              name="files"
              onChange={handleImageChange}
              onClick={(e) => e.target.value = null}
              accept="image/*"
            />
            <label htmlFor="timeline-uploadPhoto" >
              <i className="pi pi-images p-ml-1 p-px-1 addToPost-icon"></i>
            </label>
            <input
              type="file"
              id="timeline-uploadVideo"
              name="files"
              onChange={handleVideoChange}
              style={{ display: "none" }}
              accept="video/*"
              onClick={(e) => e.target.value = null}
            />
            <label htmlFor="timeline-uploadVideo" >
              <i className="pi pi-video p-ml-1 p-pr-1 addToPost-icon"></i>
            </label>
          </div>
          <div className=" p-grid p-pt-3">
            <div className="p-col-12 p-md-6">
              {
                image.preview &&
                <div className="timelineMediaItem-container">
                  <div className="dropdown font-weight-bold ml-2 portfolioItem-icons">
                    <Button type="button" role="button"
                      data-bs-toggle="dropdown"
                      id="postFormMediaItem"
                      aria-expanded="false"
                      className="timeline-postMediaItem-actionButton"
                    >
                      <i className="pi pi-ellipsis-h text-white" />
                    </Button>
                    <ul
                      className="dropdown-menu timeline-postForm-actionDropdown"
                      aria-labelledby="postFormMediaItem"
                    >
                      <li
                        className="dropdown-item"
                        onClick={deleteMediaItem}
                      >
                        <i className="pi pi-trash" />
                        Delete Image
                      </li>
                    </ul>
                  </div>
                  {mediaType == MEDIATYPES.IMAGE && <img
                    src={image.preview}
                    alt="Preview"
                    width="100%"
                    height="100%"
                    className="timelineMediaItem"
                  />}

                  {mediaType == MEDIATYPES.VIDEO && <video width="100%"
                  style={{width: '100%'}}
                    height="100%" controls>
                    <source src={image.preview} type="video/mp4" />
                    <source src="movie.ogg" type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>}
                </div>
              }
            </div>
          </div>
        </div>
        <div>
          <Button
            label="Post"
            autoFocus
            className="d-flex p-mt-3"
            type="submit"
          />
        </div>
      </form>
    </ >
  );
}

export default CreatePostModal;