import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRef } from "react";
import API_Service from "../../../../api-service/API_Service";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function TakeExamsStudents() {
	const [exam, setExam] = useState({});
	const [answeredExam, setAnsweredExam] = useState({
		subject: "",
		answer: "",
		studentId: "",
		examId: "",
	});
	const [studentAnswers, setStudentAnswers] = useState([]);

	const { userInfo } = useSelector((state) => state.auth);
	const dataStudent = userInfo.data.registeredData._id;
	const { id } = useParams();
	const formRef = useRef(null);

	useEffect(() => {
		const getExam = async () => {
			try {
				const response = await API_Service.get(`/students/exam/${id}`, {
					headers: {
						Authorization: `Bearer ${userInfo.data.token}`,
					},
				});
				setExam(response.data[0]);
				setAnsweredExam({
					examId: response.data[0]._id,
					studentId: dataStudent,
					subject: response.data[0].subject,
				});
			} catch (error) {
				console.log(error);
			}
		};

		getExam();
	}, []);

	const handleChange = (event) => {
		const { name, value } = event.target;

		//Remove any previously selected answers for the current questionName
		setStudentAnswers((prevAnswers) =>
			prevAnswers.filter((answer) => !answer.startsWith(`${name}-`))
		);

		//Add the new answer
		setStudentAnswers((prevAnswers) => [...prevAnswers, `${name}-${value}`]);

		console.log(value);
		console.log(name);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const updatedAnsweredExam = {
			...answeredExam,
			answer: studentAnswers.map((answer, index) =>
				answer.split(`question-${index}-`)[1].toUpperCase()
			),
		};

		API_Service.post("/students/exam-answers", updatedAnsweredExam, {
			headers: {
				Authorization: `Bearer ${userInfo.data.token}`,
			},
		}).then((res) => {
			console.log(res);
		}).catch = (err) => {
			console.log(err);
		};

		console.log(updatedAnsweredExam);

		// Reset the form
		formRef.current.reset();
		setStudentAnswers([]);
	};

	return (
		<div className='body__take--exam'>
			<Container className='pt-3'>
				<div>
					<Link to='/student/exams'>
						<Button variant='success' size='lg' className='mb-2'>
							<FontAwesomeIcon icon={faArrowLeft} />
							Back
						</Button>
					</Link>
				</div>
				<div className='take__exam--container'>
					<div className='title__holder py-4'>Classroom Management App</div>
					<div className='subject__exam'>Subject: {exam.subject}</div>
					<div className='title__exam'>Title: {exam.title}</div>
					<div className='d-flex justify-content-between px-4'>
						<div className='desc__exam'>Description: {exam.desc}</div>
						{/* <div>{exam._id}</div> */}
						<div className='num__exam'>Number of items: {exam.examLength}</div>
					</div>
					<div className='form__exam--container'>
						<Form ref={formRef} onSubmit={handleSubmit}>
							{exam.questions &&
								exam.questions.map((question, index) => {
									const questionName = `question-${index}`; // Add this line
									return (
										<Container key={index}>
											<div className='mt-3'>
												<div className='ques__details--exam'>
													Q{index + 1}: {question.question}
												</div>

												<Form.Check
													inline
													type='radio'
													label={`A. ${question.choice_a}`}
													name={`${questionName}`} // Modify this line
													id='optionA'
													onChange={handleChange}
													value='A'
													required
												/>
												<Form.Check
													inline
													type='radio'
													label={`B. ${question.choice_b}`}
													name={`${questionName}`} // Modify this line
													id='optionB'
													onChange={handleChange}
													value='B'
													required
												/>
												<Form.Check
													inline
													type='radio'
													label={`C. ${question.choice_c}`}
													name={`${questionName}`} // Modify this line
													id='optionC'
													onChange={handleChange}
													value='C'
													required
												/>
												<Form.Check
													inline
													type='radio'
													label={`D. ${question.choice_d}`}
													name={`${questionName}`} // Modify this line
													id='optionD'
													onChange={handleChange}
													value='D'
													required
												/>
											</div>
										</Container>
									);
								})}
							<Button type='submit' size='lg' className='btn__take--exam'>
								Submit
							</Button>
						</Form>
					</div>
				</div>
			</Container>
		</div>
	);
}
export default TakeExamsStudents;
