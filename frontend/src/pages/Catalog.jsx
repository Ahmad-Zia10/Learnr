import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import CourseCard from "../components/common/CourseCard"
import {
  useGetCategoriesQuery,
  useGetCategoryPageDetailsQuery,
} from "../services/courseApi"

const SORT_TABS = ["Most popular", "New", "Trending"]

const RELATED_RESOURCES = [
  "Doc Python",
  "Cheatsheets",
  "Articles",
  "Community Forums",
  "Projects",
]

//Sort a course list according to the selected tab.
const sortCourses = (courses, tab) => {
  const list = [...courses]
  if (tab === "New") {
    return list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
  }
  if (tab === "Trending") {
    return list.sort(
      (a, b) =>
        (b.ratingAndReviews?.length ?? 0) - (a.ratingAndReviews?.length ?? 0)
    )
  }
  //Most popular: the courses with the most enrolments the platform knows about
  return list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
}

function Catalog() {
  const { catalogName } = useParams()
  const [activeTab, setActiveTab] = useState(SORT_TABS[0])

  const { data: categories = [] } = useGetCategoriesQuery()

  //The URL carries the category name, the API wants its id.
  const category = useMemo(
    () =>
      categories.find(
        (item) => item.name?.toLowerCase() === catalogName?.toLowerCase()
      ),
    [categories, catalogName]
  )

  const {
    data: pageDetails,
    isFetching,
    isError,
  } = useGetCategoryPageDetailsQuery(category?._id, { skip: !category?._id })

  const differentCourses = pageDetails?.differentCourses ?? []
  const mostSellingCourses = pageDetails?.mostSellingCourses ?? []

  const sortedSelected = useMemo(
    () => sortCourses(pageDetails?.selectedCourses ?? [], activeTab),
    [pageDetails, activeTab]
  )

  if (isFetching) {
    return (
      <p className="mx-auto max-w-maxContent py-20 text-richblack-100">
        Loading catalog...
      </p>
    )
  }

  if (isError || (!category && categories.length)) {
    return (
      <p className="mx-auto max-w-maxContent py-20 text-richblack-100">
        We couldn&apos;t find that category.{" "}
        <Link to="/" className="text-yellow-50">
          Back to home
        </Link>
      </p>
    )
  }

  return (
    <div className="text-richblack-5">
      {/* Category hero */}
      <div className="bg-richblack-800">
        <div className="mx-auto flex min-h-[260px] max-w-maxContent flex-col justify-center gap-y-4 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[640px]">
            <p className="text-[0.875rem] text-richblack-300">
              Home / Catalog /{" "}
              <span className="text-yellow-25">{category?.name}</span>
            </p>
            <h1 className="mt-2 text-[1.875rem] font-semibold">
              {category?.name}
            </h1>
            <p className="mt-3 text-[0.875rem] leading-[1.5rem] text-richblack-200">
              {category?.description}
            </p>
          </div>

          <div>
            <p className="font-semibold">Related resources</p>
            <ul className="mt-2 list-disc pl-5 text-[0.875rem] text-richblack-200">
              {RELATED_RESOURCES.map((resource) => (
                <li key={resource}>{resource}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-maxContent px-4 py-12">
        {/* Courses to get you started */}
        <section>
          <h2 className="text-[1.75rem] font-semibold">
            Courses to get you started
          </h2>
          <div className="mt-3 flex gap-x-6 border-b border-richblack-600">
            {SORT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-1 pb-2 text-[0.875rem] ${
                  activeTab === tab
                    ? "border-b-2 border-yellow-25 text-yellow-25"
                    : "text-richblack-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {sortedSelected.length ? (
            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {sortedSelected.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  bestseller={index === 0 && activeTab === "Most popular"}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-richblack-300">
              No courses in this category yet.
            </p>
          )}
        </section>

        {/* Top courses elsewhere */}
        {differentCourses.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[1.75rem] font-semibold">
              Top courses in other categories
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {differentCourses.slice(0, 3).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Frequently bought together */}
        {mostSellingCourses.length > 0 && (
          <section className="mt-16">
            <h2 className="text-[1.75rem] font-semibold">
              Frequently Bought Together
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {mostSellingCourses.slice(0, 4).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Catalog
