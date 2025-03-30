function Message(props) {
    
    return (
        <div className="row mb-3 mt-3">
            <div className="col-sm-1">
                <div className="py-1">
                    <img src={props.message.avatar} className="fixed-size-avatar"></img>
                </div>
            </div>
            <div className="col-sm">
                <div className="py-2">
                    {props.message.text}
                </div>
            </div>          
        </div>
    )
}

export default Message;  