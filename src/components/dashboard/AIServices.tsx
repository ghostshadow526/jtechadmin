import React, { useState, useEffect } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { useAuth } from '@/src/components/FirebaseProvider';
import { Plus, Image as ImageIcon, Trash2, Loader2, DollarSign } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/osj1lakjx';
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_71xCzGlh+6p2e0Lme57TV5oiG7M=';

const authenticator = async () => {
    try {
        const response = await fetch('/api/imagekit/auth');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        throw new Error(`Authentication request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
};

export default function AIServices() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'ai_services'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ai_services');
    });

    return () => unsubscribe();
  }, []);

  const onError = (err: any) => {
    console.error("ImageKit Upload Error:", err);
    setUploading(false);
  };

  const onSuccess = (res: any) => {
    setImageUrl(res.url);
    setUploading(false);
  };

  const onUploadStart = () => {
    setUploading(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) return;

    try {
      await addDoc(collection(db, 'ai_services'), {
        name,
        price: parseFloat(price),
        imageUrl,
        createdAt: serverTimestamp(),
        userId: user?.uid
      });
      setName('');
      setPrice('');
      setImageUrl('');
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'ai_services');
    }
  };

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif italic text-white tracking-widest uppercase">Aurelian Services Portfolio</h2>
        <div className="text-[10px] uppercase tracking-widest text-accent-gold font-mono">Status: Secure Entry</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-1 bg-card-bg border border-border-subtle p-8 space-y-8">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Resource Entry</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Ref: AR-9201</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Image Designation</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Strategos Vision"
                className="w-full bg-card-active border border-border-subtle p-3 text-white text-sm focus:border-accent-gold/50 outline-none transition-colors font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Valuation (₦)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-gold font-mono text-sm">₦</span>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full bg-card-active border border-border-subtle p-3 pl-8 text-white text-sm focus:border-accent-gold/50 outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Visual Medium</label>
              <IKContext urlEndpoint={urlEndpoint} publicKey={publicKey} authenticator={authenticator}>
                <div className="relative group cursor-pointer overflow-hidden border border-dashed border-border-subtle bg-card-active/50 hover:bg-card-active transition-colors h-32 flex flex-col items-center justify-center gap-2">
                  {imageUrl ? (
                    <img src={imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                  ) : (
                    <ImageIcon className="text-gray-600 group-hover:text-accent-gold transition-colors" size={24} />
                  )}
                  {uploading ? (
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent-gold animate-pulse z-10">
                      <Loader2 size={12} className="animate-spin" /> Transferring...
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 z-10">{imageUrl ? 'Change Medium' : 'Upload Artifact'}</span>
                  )}
                  <IKUpload
                    onError={onError}
                    onSuccess={onSuccess}
                    onUploadStart={onUploadStart}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </IKContext>
            </div>

            <button 
              type="submit"
              disabled={uploading || !name || !price || !imageUrl}
              className="w-full bg-accent-gold text-bg-main p-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
            >
              Verify & Register Service
            </button>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">Active Portfolio Items</h3>
            <span className="text-[10px] font-mono text-gray-500">{services.length} Registered</span>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-accent-gold">
               <Loader2 className="animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="h-64 border border-dashed border-border-subtle flex flex-col items-center justify-center gap-4">
               <p className="text-[10px] uppercase tracking-widest text-gray-600">No active services identified in the vault.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-card-bg border border-border-subtle overflow-hidden flex flex-col group hover:border-accent-gold/40 transition-colors">
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 text-[10px] font-mono text-white bg-bg-main/80 px-2 py-1 border border-border-subtle">
                       ₦{service.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                     <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-white tracking-wide">{service.name}</h4>
                        <button className="text-gray-600 hover:text-red-400 transition-colors">
                           <Trash2 size={14} />
                        </button>
                     </div>
                     <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-600">
                        <span>Registry ID: {service.id.slice(0, 8)}</span>
                        <span>{new Date(service.createdAt?.toDate()).toLocaleDateString() || 'Pending'}</span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
