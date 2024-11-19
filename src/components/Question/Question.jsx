import './Question.css'

export default function Question(props) {
    return (
        <div className="question-container">
            <span className='category'>{props.category}</span>
            <h2 className="question">{props.question}</h2>
            {props.children}
            <hr />
        </div>
    )
}