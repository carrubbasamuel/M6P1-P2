import React, { useEffect } from "react";
import { LuDelete } from "react-icons/lu";
import { MdBuild } from "react-icons/md";
import Lottie from "react-lottie";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeleteReview,
  fetchGetReviews,
  setReviewToEdit,
  setShowModal,
  setShowModalEditMode,
  setRating
} from "../../../redux/reducers/ReviewSlice";
import Rate from "./Rate";



export default function ReviewList({ postId }) {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.review);
  const showModalEditMode = useSelector(state => state.review.showModalEditMode);

  const handleEditMode = (review) => {
    dispatch(setReviewToEdit(review))
    dispatch(setRating(review.rate));
    dispatch(setShowModal(false))
    dispatch(setShowModalEditMode(true));
  };

  useEffect(() => {
    if (showModalEditMode === false) {
      dispatch(fetchGetReviews(postId))
    }
  }, [showModalEditMode, dispatch, postId])


  return (
    <>
      {loading && reviews.length === 0 && <div>Loading...</div>}
      {reviews.length === 0 &&
        <div className="d-flex flex-column align-items-center mt-3">
          <h2>No reviews yet</h2>
          <p>Be the first to review this post</p>
          <div className="w-25">
            <Lottie options={{
              loop: true,
              autoplay: true,
              animationData: require('./noreview.json'),
            }} />

          </div>
        </div>
      }
      <div className="p-3 reviewList">
        {reviews.map((review) => (
          <div key={review._id} className="d-flex justify-content-between reviews">
            <div className="d-flex flex-column">
              <p>{review.comment}</p>
              <div className="d-flex align-items-center justify-content-center h-50 w-50">
                <Rate rate={review.rate} />
              </div>
            </div>
            <div className="d-flex flex-column align-items-end justify-content-center">
              <p><img className="w-25 rounded-circle m-2 shadow" src={review.authorId.avatar} alt="img-profile" />   {review.authorId.email}</p>
              <div className="d-flex">
                {review.isMine === true && <MdBuild style={{ cursor: 'pointer', fontSize: '18px', marginRight: '10px' }} onClick={() => handleEditMode(review)} />}
                {review.isMine === true && <LuDelete style={{ cursor: 'pointer', fontSize: '22px' }} onClick={() => dispatch(fetchDeleteReview(review._id)).then(() => dispatch(fetchGetReviews(postId)))} />}
              </div>

            </div>

          </div>

        ))}
      </div>
    </>


  );
}
