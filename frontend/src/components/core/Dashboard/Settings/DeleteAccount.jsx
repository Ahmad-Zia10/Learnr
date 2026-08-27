import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FiTrash2 } from "react-icons/fi"
import { useDeleteAccountMutation } from "../../../../services/profileApi"
import { setToken } from "../../../../store/authSlice"
import { setProfile } from "../../../../store/profileSlice"
import { resetCart } from "../../../../store/cartSlice"

function DeleteAccount() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState(null)

  const [deleteAccount, { isLoading }] = useDeleteAccountMutation()

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteAccount().unwrap()
      //the account is gone, so clear every trace of the session
      dispatch(setToken(null))
      dispatch(setProfile(null))
      dispatch(resetCart())
      navigate("/")
    } catch (err) {
      setError(err?.data?.message || "Could not delete the account.")
    }
  }

  return (
    <section className="mt-8 flex gap-x-4 rounded-md border border-pink-700 bg-pink-900 p-8">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pink-700">
        <FiTrash2 size={20} className="text-pink-200" />
      </div>

      <div>
        <p className="text-[1.125rem] font-semibold text-richblack-5">
          Delete Account
        </p>
        <p className="mt-2 max-w-[520px] text-[0.875rem] text-pink-25">
          Would you like to delete your account? This account may contain paid
          courses. Deleting it removes all the content associated with it, and
          cannot be undone.
        </p>

        {error && <p className="mt-3 text-[0.875rem] text-pink-200">{error}</p>}

        {confirming ? (
          <div className="mt-4 flex gap-x-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="cursor-pointer rounded-md bg-pink-200 px-5 py-2 text-[0.875rem] font-medium text-richblack-900
              disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Deleting..." : "Yes, delete my account"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="cursor-pointer rounded-md bg-richblack-700 px-5 py-2 text-[0.875rem] font-medium text-richblack-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-4 cursor-pointer text-[0.875rem] italic text-pink-200 underline"
          >
            I want to delete my account.
          </button>
        )}
      </div>
    </section>
  )
}

export default DeleteAccount
