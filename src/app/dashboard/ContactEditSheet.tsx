import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Contact } from '@/domain/entities/Contact';

interface ContactEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingContact: Contact | null;
  contactForm: {
    name: string;
    company: string;
    phoneNumber: string;
    contactEmail: string;
  };
  onContactFormChange: (form: {
    name: string;
    company: string;
    phoneNumber: string;
    contactEmail: string;
  }) => void;
  onSave: () => void;
}

export function ContactEditSheet({
  open,
  onOpenChange,
  editingContact,
  contactForm,
  onContactFormChange,
  onSave,
}: ContactEditSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {editingContact ? 'Edit Contact' : 'Create Contact'}
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={contactForm.name}
              onChange={(e) => onContactFormChange({...contactForm, name: e.target.value})}
              placeholder="Enter contact name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={contactForm.company}
              onChange={(e) => onContactFormChange({...contactForm, company: e.target.value})}
              placeholder="Enter company"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={contactForm.phoneNumber}
              onChange={(e) => onContactFormChange({...contactForm, phoneNumber: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contactForm.contactEmail}
              onChange={(e) => onContactFormChange({...contactForm, contactEmail: e.target.value})}
              placeholder="Enter email"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              {editingContact ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}