import React from "react";

function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  return (
    <div>
      <h1>CourseDetailsPage : {params.courseId}</h1>
    </div>
  );
}

export default CourseDetailsPage;
