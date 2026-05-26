import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, arrayUnion, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { useAuth } from '@/src/components/FirebaseProvider';
import { Loader2, Send, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface Message {
  sender: string;
  senderEmail: string;
  text: string;
  timestamp: any;
}

interface Complaint {
  id: string;
  name: string;
  email: string;
  complaint: string;
  messages: Message[];
  createdAt: any;
  status: 'pending' | 'completed';
}

export default function Complaints() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState('');
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsSnap = await getDocs(collection(db, 'customer_care'));
        const complaintsData = complaintsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            status: data.status || 'pending',
            messages: data.messages || []
          };
        }) as Complaint[];
        
        const sorted = complaintsData.sort((a, b) => 
          new Date(b.createdAt?.toDate()).getTime() - new Date(a.createdAt?.toDate()).getTime()
        );
        
        setComplaints(sorted);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        handleFirestoreError(error, OperationType.LIST, 'customer_care');
      }
    };

    fetchComplaints();
  }, []);

  const handleSendMessage = async () => {
    if (!selectedComplaint || !responseText.trim()) return;

    try {
      const newMessage: Message = {
        sender: 'Admin',
        senderEmail: user?.email || 'admin@jtech.com',
        text: responseText.trim(),
        timestamp: new Date()
      };

      await updateDoc(doc(db, 'customer_care', selectedComplaint.id), {
        messages: arrayUnion(newMessage),
        updatedAt: serverTimestamp()
      });

      // Update local state
      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id 
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      ));

      setSelectedComplaint(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
      setResponseText('');
      
      setNotification({ message: 'Message sent successfully!', visible: true });
      setTimeout(() => setNotification({ message: '', visible: false }), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      handleFirestoreError(error, OperationType.UPDATE, `customer_care/${selectedComplaint.id}`);
    }
  };

  const handleCompleteComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      await updateDoc(doc(db, 'customer_care', selectedComplaint.id), {
        status: 'completed'
      });

      setComplaints(complaints.map(c => 
        c.id === selectedComplaint.id 
          ? { ...c, status: 'completed' }
          : c
      ));

      setSelectedComplaint(prev => prev ? { ...prev, status: 'completed' } : null);
      
      setNotification({ message: 'Complaint marked as completed!', visible: true });
      setTimeout(() => setNotification({ message: '', visible: false }), 3000);
    } catch (error) {
      console.error('Error updating complaint:', error);
      handleFirestoreError(error, OperationType.UPDATE, `customer_care/${selectedComplaint.id}`);
    }
  };

  const handleDeleteComplaint = async () => {
    if (!selectedComplaint) return;

    try {
      await deleteDoc(doc(db, 'customer_care', selectedComplaint.id));

      setComplaints(complaints.filter(c => c.id !== selectedComplaint.id));
      setSelectedComplaint(null);
      
      setNotification({ message: 'Complaint deleted successfully!', visible: true });
      setTimeout(() => setNotification({ message: '', visible: false }), 3000);
    } catch (error) {
      console.error('Error deleting complaint:', error);
      handleFirestoreError(error, OperationType.DELETE, `customer_care/${selectedComplaint.id}`);
    }
  };

  return (
    <div className="p-10 space-y-10">
      {/* Notification */}
      {notification.visible && (
        <div className="fixed top-8 right-8 bg-black border border-white px-6 py-4 text-white text-sm font-mono uppercase tracking-widest animate-in fade-in z-50 max-w-xs">
          {notification.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif italic text-white tracking-widest uppercase">Customer Complaints</h2>
        <div className="text-[10px] uppercase tracking-widest text-accent-gold font-mono">
          {complaints.length} Total
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Complaints List */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-accent-gold">
              <Loader2 className="animate-spin" />
            </div>
          ) : complaints.length === 0 ? (
            <div className="h-64 border border-dashed border-border-subtle flex flex-col items-center justify-center gap-4">
              <AlertCircle size={32} className="text-gray-600" />
              <p className="text-[10px] uppercase tracking-widest text-gray-600">No complaints found.</p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div
                key={complaint.id}
                onClick={() => setSelectedComplaint(complaint)}
                className={`p-4 border cursor-pointer transition-all ${
                  selectedComplaint?.id === complaint.id
                    ? 'bg-card-active border-accent-gold/50'
                    : complaint.status === 'completed'
                    ? 'bg-card-bg border-border-subtle hover:border-accent-gold/30'
                    : 'bg-card-bg border-border-subtle hover:border-accent-gold/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{complaint.name}</h4>
                    <p className="text-[9px] text-gray-500">{complaint.email}</p>
                  </div>
                  <span className={`text-[8px] font-mono px-2 py-1 ${
                    complaint.status === 'completed'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {complaint.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">{complaint.complaint}</p>
                <div className="flex justify-between text-[9px] text-gray-500">
                  <span>{complaint.messages.length} messages</span>
                  <span>{new Date(complaint.createdAt?.toDate()).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Complaint Details & Messages */}
        <div className="lg:col-span-2 bg-card-bg border border-border-subtle p-8 space-y-6 flex flex-col h-[600px]">
          {selectedComplaint ? (
            <>
              {/* Complaint Header */}
              <div className="space-y-4 pb-4 border-b border-border-subtle">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{selectedComplaint.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">{selectedComplaint.email}</p>
                  </div>
                  <span className={`text-[8px] font-mono px-3 py-1 ${
                    selectedComplaint.status === 'completed'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {selectedComplaint.status.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Original Complaint</p>
                  <p className="text-sm text-gray-300 leading-relaxed bg-card-active p-3 border border-border-subtle">
                    {selectedComplaint.complaint}
                  </p>
                </div>

                <div className="text-[9px] text-gray-500">
                  Submitted: {new Date(selectedComplaint.createdAt?.toDate()).toLocaleString()}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {selectedComplaint.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p className="text-[10px] uppercase tracking-widest">No messages yet. Send the first response.</p>
                  </div>
                ) : (
                  selectedComplaint.messages.map((message, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 rounded-sm border ${
                        message.sender === 'Admin'
                          ? 'bg-green-900/20 border-green-900/30 ml-8'
                          : 'bg-blue-900/20 border-blue-900/30 mr-8'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${
                          message.sender === 'Admin' ? 'text-green-400' : 'text-blue-400'
                        }`}>
                          {message.sender}
                        </span>
                        <span className="text-[8px] text-gray-500">
                          {new Date(message.timestamp?.toDate?.()).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{message.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              {selectedComplaint.status === 'pending' ? (
                <div className="space-y-4 pt-4 border-t border-border-subtle">
                  <div>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response message..."
                      className="w-full bg-card-active border border-border-subtle p-3 text-white text-sm focus:border-accent-gold/50 outline-none transition-colors font-mono resize-none h-24"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSendMessage}
                      disabled={!responseText.trim()}
                      className="flex-1 bg-accent-gold text-bg-main p-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      Send Message
                    </button>
                    <button
                      onClick={handleCompleteComplaint}
                      className="flex-1 bg-green-900/30 text-green-400 border border-green-900/50 p-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-green-900/50 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={14} />
                      Mark Completed
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-border-subtle space-y-3">
                  <div className="bg-green-900/20 border border-green-900/30 p-4 rounded-sm text-center">
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">✓ This complaint has been completed</p>
                  </div>
                  <button
                    onClick={handleDeleteComplaint}
                    className="w-full bg-red-900/30 text-red-400 border border-red-900/50 p-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-900/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete Complaint
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-gray-500">
              <AlertCircle size={32} />
              <p className="text-[10px] uppercase tracking-widest">Select a complaint to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
