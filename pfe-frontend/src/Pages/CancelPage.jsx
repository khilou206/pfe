// Pages/CancelPage.jsx
import { Link } from 'react-router-dom';

const CancelPage = () => (
    <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ color: 'red' }}>The process has been cancelled❌</h1>
        <p>It appears you have cancelled your payment. You can return to your cart and try again.</p>
        <Link to="/panier">Back to the basket</Link>
    </div>
);

export default CancelPage;