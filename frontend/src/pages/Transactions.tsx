import { Table, Spinner, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getTransactions, updateTransaction, Tag } from '../services/api';
import TagInput from '../components/TagInput';
import TagFilter from '../components/TagFilter';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category_id: number | null;
  tags: Tag[];
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editTags, setEditTags] = useState<Tag[]>([]);
  
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, [selectedTagIds]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const tagsParam = selectedTagIds.length > 0 ? selectedTagIds.join(',') : undefined;
      const data = await getTransactions(tagsParam);
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions. Please ensure you are logged in.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
    setEditTags(tx.tags || []);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingTx) return;
    try {
        await updateTransaction(editingTx.id, {
            tag_ids: editTags.map(t => t.id)
        });
        setShowEditModal(false);
        fetchTransactions(); // Refresh list
    } catch (err) {
        console.error("Failed to save transaction", err);
        alert("Failed to save");
    }
  };

  return (
    <div>
      <Row className="mb-4 align-items-center">
        <Col><h2>Transactions</h2></Col>
        <Col xs="auto">
            <TagFilter selectedTagIds={selectedTagIds} onFilterChange={setSelectedTagIds} />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-5"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger" className="mt-4">{error}</Alert>
      ) : (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">No transactions found.</td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.description}</td>
                <td className={tx.amount < 0 ? 'text-danger' : 'text-success'}>
                  ${Number(tx.amount).toFixed(2)}
                </td>
                <td>
                    {tx.tags && tx.tags.map(t => (
                        <span key={t.id} className="badge bg-secondary me-1" style={{backgroundColor: t.color}}>{t.name}</span>
                    ))}
                </td>
                <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(tx)}>Edit</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {editingTx && (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control type="text" value={editingTx.description} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label>
                        <TagInput selectedTags={editTags} onTagsChange={setEditTags} />
                    </Form.Group>
                </Form>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Transactions;
