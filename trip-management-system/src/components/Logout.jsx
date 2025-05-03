import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    const user = auth.currentUser;

    try {
      if (user) {
        // Call backend to delete user by firebase UID
        await fetch(`http://localhost:5000/api/deleteuserbyuid/${user.uid}`, {
          method: 'DELETE',
        });
        console.log('User deleted from backend');

        // Remove from localStorage if used
     
      }

      await signOut(auth);
      console.log('User signed out successfully');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout or user deletion:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '30px',
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
