import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import API_Service from "../../../api-service/API_Service";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import StudentScores from "../student-component/Student_Scores";

const Activity_Details = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [exam, setExam] = useState({});
  const [answers, setAnswers] = useState({});
  const [student, setStudent] = useState({});

  const { id } = useParams();

  useEffect(() => {
    const getExam = async () => {
      try {
        const response = await API_Service.get(`/teachers/activities/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.data.token}`,
          },
        });
        setExam(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getExam();
  }, [id]);

  useEffect(() => {
    const getAnswer = async () => {
      try {
        const response = await API_Service.get(
          `/teachers/get-students-answered-exams/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.data.token}`,
            },
          }
        );
        console.log(response.data);
        setAnswers(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getAnswer();
  }, [id]);
  console.log(answers.studentId);
  useEffect(() => {
    const getStudent = async () => {
      // try {
      //   const response = await API_Service.get(
      //     `/teachers/get-students/${answers.studentId}`,
      //     {
      //       headers: {
      //         Authorization: `Bearer ${userInfo.data.token}`,
      //       },
      //     }
      //   );
      //   console.log(response.data);
      //   setStudent(response.data);
      // } catch (error) {
      //   console.log(error);
      // }
    };

    getStudent();
  }, []);

  return (
    <>
      <Container className="my-3">
        <div className="questionaire">
          <Link to="/teacher/activities">
            <Button
              variant="success"
              size="sm"
              style={{ marginBottom: -40, width: 90 }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back
            </Button>
          </Link>
          <h3 className="text-center ms-5">Activity Details</h3>
          <div className="d-flex">
            <h6>Subject: </h6> <span className="ms-4">{exam.subject}</span>
          </div>
          <div className="d-flex">
            <h6>Title: </h6>
            <span className="ms-4">{exam.title}</span>
          </div>
          <div className="d-flex">
            <h6>Description: </h6>
            <span className="ms-4">{exam.desc}</span>
          </div>
          <div className="d-flex">
            <h6>Activity No: </h6> <span className="ms-4">{exam._id}</span>
          </div>
          <div className="d-flex">
            <h6>Activity Length: </h6>
            <span className="ms-4">{exam.examLength}</span>
          </div>

          <h6>Questions</h6>
          {exam.questions &&
            exam.questions.map((question, index) => {
              return (
                <Container key={index} className="mb-3">
                  <div className="mt-3 view-questionaire">
                    <h6>
                      Q{index + 1}: {question.question}
                    </h6>
                    <div className="">
                      <span className="mx-3">A. {question.choice_a}</span>
                      <span className="mx-3">B. {question.choice_b}</span>
                      <span className="mx-3">C. {question.choice_c}</span>
                      <span className="mx-3">D. {question.choice_d}</span>
                      <span className="mx-3">AK. {question.answer}</span>
                    </div>
                  </div>
                </Container>
              );
            })}
        </div>
      </Container>
      <Container className="my-4">
        <hr />
        {!answers.length ? (
          <h6 className="ms-5">No student take the exam yet!...... </h6>
        ) : (
          <StudentScores />
        )}
      </Container>
    </>
  );
};

export default Activity_Details;
