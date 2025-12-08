import { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { getUser, updateUser, triggerSync } from '../services/api';

const Settings = () => {
  const [simpleFinUrl, setSimpleFinUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUser();
        setSimpleFinUrl(user.simplefin_access_url || '');
      } catch (err) {
        console.error(err);
        setMessage({ type: 'danger', text: 'Failed to load user settings.' });
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateUser({ simplefin_access_url: simpleFinUrl });
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Failed to save settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      await triggerSync();
      setMessage({ type: 'success', text: 'Sync started successfully.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Sync failed. Check your SimpleFIN URL.' });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div>
      <h2>Settings</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      
      <Card className="mt-4">
        <Card.Header>SimpleFIN Integration</Card.Header>
        <Card.Body>
          <Card.Text>
            Enter your SimpleFIN Access URL to sync your bank accounts.
            <br />
            <small className="text-muted">
              Don't have one? Get it from <a href="https://beta-bridge.simplefin.org/" target="_blank" rel="noreferrer">SimpleFIN Bridge</a>.
            </small>
          </Card.Text>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Access URL</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="https://..." 
                value={simpleFinUrl} 
                onChange={(e) => setSimpleFinUrl(e.target.value)} 
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save URL'}
            </Button>
            {' '}
            <Button variant="success" onClick={handleSync} disabled={syncing || !simpleFinUrl}>
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
