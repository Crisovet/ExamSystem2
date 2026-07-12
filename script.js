fetch("questions.json")
.then(response => response.json())
.then(data => {

    document.getElementById("examTitle").innerHTML = data.examTitle;

    const container = document.getElementById("questions");

    data.questions.forEach((q, index) => {

        let html = "";

        html += `<div class="question">`;

        html += `<h3>Q${index + 1}. ${q.question}</h3>`;

        // MCQ SINGLE
        if (q.type === "mcq_single") {

            q.options.forEach((option, i) => {

                html += `
                <label class="option">
                    <input type="radio"
                        name="q${index}"
                        value="${i}">
                    ${option}
                </label>
                `;

            });

        }

        // FILL IN THE BLANK
        else if (q.type === "fill_blank") {

            html += `
                <input
                    type="text"
                    name="q${index}"
                    class="fill-blank-input"
                    autocomplete="off"
                    placeholder="Type your answer">
            `;

        }

        html += `</div>`;

        container.innerHTML += html;

    });


    document.getElementById("submitBtn").onclick = function () {

        let answers = [];

        data.questions.forEach((q, index) => {

            // MCQ ANSWER
            if (q.type === "mcq_single") {

                const selected =
                    document.querySelector(
                        `input[name="q${index}"]:checked`
                    );

                answers.push(
                    selected
                        ? parseInt(selected.value)
                        : -1
                );

            }

            // FILL BLANK ANSWER
            else if (q.type === "fill_blank") {

                const input =
                    document.querySelector(
                        `input[name="q${index}"]`
                    );

                answers.push(
                    input
                        ? input.value
                        : ""
                );

            }

            else {

                answers.push(null);

            }

        });


        localStorage.setItem(
            "questions",
            JSON.stringify(data.questions)
        );

        localStorage.setItem(
            "answers",
            JSON.stringify(answers)
        );


        window.location.href = "result.html";

    };

})
.catch(error => console.log(error));