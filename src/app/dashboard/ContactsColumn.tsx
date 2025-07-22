import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Contact } from '@/domain/entities/Contact';

interface ContactsColumnProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: boolean;
  error: string;
  onSelectContact: (contact: Contact) => void;
  onCreateContact: () => void;
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

export function ContactsColumn({
  contacts,
  selectedContact,
  loading,
  error,
  onSelectContact,
  onCreateContact,
  onEditContact,
  onDeleteContact,
}: ContactsColumnProps) {
  return (
    <div className="w-1/3 border-r bg-white flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Contacts</h2>
          <Button onClick={onCreateContact} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card 
                key={contact.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditContact(contact);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteContact(contact);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-gray-600">
                    {contact.company && <p>Company: {contact.company}</p>}
                    {contact.phoneNumber && <p>Phone: {contact.phoneNumber}</p>}
                    {contact.contactEmail && <p>Email: {contact.contactEmail}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}