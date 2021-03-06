import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProfileInfo } from "store/modules/account";

const ReviewTab = () => {
  const dispatch = useDispatch();
  const applicantReview = useSelector((state) => state.account.profileInfo);

  console.log("review-details", applicantReview);

  useEffect(() => {
    dispatch(loadProfileInfo());
  }, []);

  return (
    <>
      {/* <div className="p-card p-4 mt-2">
                <h3>Reviews</h3>
            </div> */}
      <div className="mt-1">
        {applicantReview?.reviews &&
          applicantReview?.reviews?.length > 0 &&
          applicantReview?.reviews?.map((review, index) => (
            <div
              className="p-card p-4 mt-2 d-flex justify-content-between"
              key={index}
            >
              <div className="d-flex">
                <div className="d-col text-center">
                  <div>
                    <p>{review?.reviewerDisplayName}</p>
                  </div>
                  {/* {review.imageUrl ? <img src={review.imageUrl}
                    className="rounded-circle"
                    alt="review'sImage"
                  /> : <img
                    src="https://source.unsplash.com/random/50x50"
                    className="rounded circle"
                    alt="image"
                  />} */}
                </div>
                <div className="p-2"></div>
                <div>
                  <ul>
                    <li className="d-flex text-capitalize text-center app-color font-weight-bold">
                      {review?.title}
                    </li>
                    <li className="d-flex flex-column">
                      <p className="p-1">{ }</p>
                      <span>
                        <div
                          className="stars"
                          style={{ "--rating": review?.rating }}
                        ></div>
                      </span>
                    </li>

                    <li className="d-flex">{review?.detail}</li>
                  </ul>
                </div>
              </div>
              <p className="align-right">
                {moment(review?.createdAt).format("MMMM DD, YYYY")}
              </p>
            </div>
          ))}
        {applicantReview?.reviews?.length === 0 && (
          <strong className="mx-auto text-secondary">No review found</strong>
        )}
      </div>
    </>
  );
};

export default ReviewTab;
