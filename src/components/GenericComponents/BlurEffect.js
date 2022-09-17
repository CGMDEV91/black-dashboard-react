

const BlurEffect = (props) => {
    return(
        <>
            <div className="blur-component text-white"></div>
            <div className="blur-component-text">
                <h2>{props.text}</h2>
            </div>
        </>
    )
}

export default BlurEffect;