/** @format */

import React, { useState } from "react";
import Groq from "groq-sdk";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

const GroqApiKey = import.meta.env.VITE_GROQ_API_KEY;
const ServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const MyEmail = import.meta.env.VITE_MY_EMAIL;
const groq = new Groq({ apiKey: GroqApiKey, dangerouslyAllowBrowser: true });

export default function Home() {
	const [fileText, setFileText] = useState("");
	const [prompt, setPrompt] = useState("");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const [emails, setEmails] = useState("");
	const [fileName, setFileName] = useState("");

	const handleFileUpload = (e) => {
		if (!e.target.files || e.target.files.length === 0) return;
		const file = e.target.files[0];
		// console.log(file);
		setFileName(file.name);

		const reader = new FileReader();
		reader.onload = (ev) => {
			setFileText(ev.target.result);
		};
		reader.readAsText(file);
	};

	async function getGroqChatCompletion() {
		return groq.chat.completions.create({
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{
					role: "user",
					content: `${prompt}\n\nTranscript:\n${fileText}`,
				},
			],
			model: "openai/gpt-oss-20b",
		});
	}

	const generateSummary = async () => {
		if (!fileText.trim()) {
			toast.error("Upload Transcript!");
			return;
		}
		if (!prompt.trim()) {
			toast.error("Custom prompt is required to generate summary");
			return;
		}
		setLoading(true);
		const id = toast.loading("Generating summary...");
		try {
			const response = await getGroqChatCompletion();
			setSummary(response.choices[0]?.message?.content);
			toast.success("Summary generated successfully");
			setFileText("");
			setPrompt("");
			setFileName("");
			// console.log(response)
		} catch (error) {
			toast.error("Error in generating summary");
			console.log(error.message);
		}
		toast.dismiss(id);
		setLoading(false);
	};

	const sendEmail = () => {
		if (!summary.trim()) {
			toast.error("Generate summary first it is required to send email");
			return;
		}
		if (!emails.trim()) {
			toast.error("Recipient emails are required to send email");
			return;
		}

		const id = toast.loading("Sending email...");
		emailjs
			.send(
				ServiceId,
				TemplateId,
				{
					to_email: emails,
					from_email: MyEmail,
					message: summary,
				},
				PublicKey
			)
			.then(() => {
                toast.success("Email sent!");
                setSummary("");
                setEmails("");
			})
			.catch(() => {
				toast.error("Failed to send email");
			});
		toast.dismiss(id);
	};

	return (
		<div className="container my-5">
			<div className="row justify-content-center">
				<div className="col-md-8 col-lg-6">
					<div className="card shadow-lg p-4 rounded">
						<h2 className="text-center mb-4">AI Meeting Notes Summarizer</h2>

						<form>
							<div
								className="mb-3"
								style={{ display: "flex", gap: "5px", alignItems: "center" }}>
								<div>
									<label
										className="form-label"
										htmlFor="fileTranscript"
										style={{
											borderRadius: "5px",
											cursor: "pointer",
											padding: "5px",
											border: "1px solid #ced4da",
										}}>
										Upload Transcript
									</label>
									<input
										style={{ display: "none" }}
										type="file"
										id="fileTranscript"
										className="form-control"
										onChange={handleFileUpload}
									/>
								</div>
								<div style={{ paddingBottom: "5px" }}>{fileName}</div>
							</div>

							<div className="mb-3">
								<label className="form-label">Custom Prompt</label>
								<textarea
									className="form-control"
									style={{ border: "1px solid" }}
									rows="3"
									placeholder="Enter custom prompt..."
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
								/>
							</div>

							<div className="d-grid mb-3">
								<button
									type="button"
									className="btn btn-primary"
									onClick={generateSummary}
									disabled={loading}>
									{loading ? "Generating..." : "Generate Summary"}
								</button>
							</div>

							<div className="mb-3">
								<label className="form-label">Summary</label>
								<textarea
									style={{ border: "1px solid" }}
									className="form-control"
									rows="8"
									value={summary}
									onChange={(e) => setSummary(e.target.value)}
								/>
							</div>

							<div className="mb-3">
								<label className="form-label">Recipient Emails</label>
								<input
									type="text"
									style={{ border: "1px solid" }}
									className="form-control"
									placeholder="Enter recipient emails "
									value={emails}
									onChange={(e) => setEmails(e.target.value)}
								/>
							</div>

							<div className="d-grid">
								<button
                                    type="button"
                                    disabled={loading}
									className="btn btn-success"
									onClick={sendEmail}>
									Send via Email
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
