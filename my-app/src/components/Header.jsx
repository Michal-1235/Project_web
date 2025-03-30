function Header({messages}) {

    return (
        <div className="row mb-3">
            <div className="col-sm-3 text-start">
                <div className="h3 py-2">Not Twitter</div>
            </div>
            <div className="col-sm-3 py-3 text-start">
                Unread: {messages.length}
            </div>
            <div className="col-sm" />
            
            
        </div>
    )
}

export default Header;