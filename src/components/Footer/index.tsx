import { FC } from "react"

const Footer: FC = () => {

    const footerStyle = {
        height: '40px',
        lineHeight: '40px',
        display: 'flex',
        justifyContent: 'center',
        fontSize: '14px',
        color: '#666',
        background: '#fff',
        borderTop: '1px solid #eee',
        zIndex: 0
    }

    return (
        <footer style={footerStyle}>
            Copyright © 2022 Pinxixi. All right reserved.
        </footer>
    )

}

export default Footer