import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-surface">
    <h1 className="text-8xl font-bold text-primary">404</h1>
    <p className="text-xl text-gray-500 mt-2 mb-6">Page not found</p>
    <Link to="/dashboard" className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
      Go to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;