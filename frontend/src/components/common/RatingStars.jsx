import { TiStar, TiStarHalf, TiStarOutline } from "react-icons/ti"

//Five stars, filled to the nearest half.
function RatingStars({ rating = 0, size = 16 }) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5

  return (
    <span className="flex items-center gap-0.5 text-yellow-100">
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < full) return <TiStar key={index} size={size} />
        if (index === full && hasHalf)
          return <TiStarHalf key={index} size={size} />
        return <TiStarOutline key={index} size={size} className="text-richblack-500" />
      })}
    </span>
  )
}

export default RatingStars
