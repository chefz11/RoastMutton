import { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';
import './GroupSetup.css';

function GroupSetup({ group, onCreateGroup, onJoinGroup }) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    const result = await onCreateGroup();
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    const result = await onJoinGroup(inviteCode);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (group && group.members.length === 1) {
    // User has created group, waiting for buddy
    return (
      <div className="group-setup card golden">
        <Users size={48} />
        <h2>Waiting for Your Reading Buddy</h2>
        <p>Share this invite code with your friend:</p>
        <div className="invite-code-display">
          <span className="code">{group.inviteCode}</span>
          <button onClick={handleCopy} className="copy-button">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
        <p className="hint">They'll enter this code when they first sign in</p>
      </div>
    );
  }

  if (!group) {
    // User needs to create or join group
    return (
      <div className="group-setup card golden">
        <Users size={48} />
        <h2>Connect with Your Reading Buddy</h2>

        <div className="setup-options">
          <div className="option">
            <h3>Start a New Group</h3>
            <p>Create a reading group and get an invite code to share</p>
            <button onClick={handleCreate}>Create Group</button>
          </div>

          <div className="divider">OR</div>

          <div className="option">
            <h3>Join Your Friend's Group</h3>
            <p>Enter the invite code they shared with you</p>
            <form onSubmit={handleJoin}>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="MUTTON-XXXX"
                pattern="MUTTON-[A-Z0-9]{4}"
                maxLength={11}
              />
              <button type="submit">Join Group</button>
            </form>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    );
  }

  return null;
}

export default GroupSetup;
