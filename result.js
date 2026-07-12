const questions = JSON.parse(localStorage.getItem("questions"));
const answers = JSON.parse(localStorage.getItem("answers"));

let score = 0;

const container = document.getElementById("results");


function normalizeAnswer(text) {

    return String(text)
        .toLowerCase()
        .trim()
        .replace(/\s/g, "")
        .replace(/-/g, "");
}


function levenshteinDistance(a, b) {

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (b[i - 1] === a[j - 1]) {

                matrix[i][j] = matrix[i - 1][j - 1];

            } else {

                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );

            }

        }

    }

    return matrix[b.length][a.length];
}


function similarity(a, b) {

    a = normalizeAnswer(a);
    b = normalizeAnswer(b);

    if (a === b) {
        return 1;
    }

    if (a.length === 0 || b.length === 0) {
        return 0;
    }

    const distance = levenshteinDistance(a, b);

    return 1 - (
        distance / Math.max(a.length, b.length)
    );
}


questions.forEach((q, index) => {

    const student = answers[index];

    let isCorrect = false;

    let studentAnswer = "Not Answered";
    let correctAnswer = "";


    // MCQ

    if (q.type === "mcq_single") {

        const correct = q.answer;

        isCorrect = student === correct;

        studentAnswer =
            student === -1
                ? "Not Answered"
                : q.options[student];

        correctAnswer = q.options[correct];

    }


    // FILL IN THE BLANK

    else if (q.type === "fill_blank") {

        studentAnswer =
            student && student.trim() !== ""
                ? student
                : "Not Answered";

        correctAnswer = q.answers[0];

        const threshold = q.matchThreshold ?? 0.7;

        let highestSimilarity = 0;

        q.answers.forEach(answer => {

            const match = similarity(student, answer);

            if (match > highestSimilarity) {
                highestSimilarity = match;
            }

        });

        isCorrect = highestSimilarity >= threshold;

    }


    if (isCorrect) {
        score += q.marks ?? 1;
    }


    const resultClass =
        isCorrect
            ? "correct-question"
            : "wrong-question";


    let html = `

        <div class="question ${resultClass}">

            <h3>
                Q${index + 1}. ${q.question}
            </h3>

            <p>
                <b>Your Answer:</b>
                ${studentAnswer}
            </p>

            <p>
                <b>Correct Answer:</b>
                ${correctAnswer}
            </p>

            <p class="result-status">
                <b>
                    ${isCorrect
                        ? "✓ Correct"
                        : "✗ Incorrect"}
                </b>
            </p>

            <p>
                <b>Explanation:</b>
                ${q.explanation ?? ""}
            </p>

        </div>

    `;

    container.innerHTML += html;

});


const totalMarks = questions.reduce(
    (total, q) => total + (q.marks ?? 1),
    0
);


document.getElementById("score").innerHTML =
    `Score : ${score} / ${totalMarks}`;