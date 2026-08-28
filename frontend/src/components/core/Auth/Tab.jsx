//Student / Instructors segmented toggle used on the login and signup forms.
function Tab({ tabs, value, onChange }) {
  return (
    <div
      className="flex max-w-max gap-x-1 rounded-full bg-richblack-800 p-1"
      style={{ boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`cursor-pointer rounded-full px-[18px] py-[7px] text-[0.875rem] transition-all duration-200 ${
            value === tab.value
              ? "bg-richblack-900 text-richblack-5"
              : "bg-transparent text-richblack-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default Tab
