import React, { useState } from 'react';
import { ArrowLeft, Edit, Plus, Trash2, FileText, Upload, Download, Eye } from 'lucide-react';

interface LoanOption {
  loanToCost: string;
  loanAmount: string;
  rate: string;
  originationFee: string;
  payment: string;
}

interface FormData {
  transactionType: string;
  product: string;
  propertyState: string;
  ficoScore: string;
  currentlyOwnedRentals: string;
  fixFlipExits: string;
  groundUpExits: string;
  refinance: string;
  propertyOwned24Months: string;
  previouslyCompletedRehab: string;
  purchasePrice: string;
  totalLoanAmount: string;
  estimatedRehabCost: string;
  afterRepairValue: string;
  loanTerm: string;
  interestOnUndrawn: string;
  reduceRateFee: string;
}

interface LoanSummaryProps {
  selectedLoan: LoanOption;
  formData: FormData;
  onBack: () => void;
  onUpdateLoan: (loan: LoanOption) => void;
}

interface RehabItem {
  id: string;
  category: string;
  description: string;
  budgeted: number;
  actual: number;
}

interface WorkItem {
  id: string;
  description: string;
  budgeted: number;
  actual: number;
}

interface EntityMember {
  id: string;
  name: string;
  title: string;
  ownershipPercentage: number;
  ssn: string;
  email: string;
  phone: string;
}

interface Guarantor {
  id: string;
  name: string;
  ssn: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const LoanSummary: React.FC<LoanSummaryProps> = ({ selectedLoan, formData, onBack, onUpdateLoan }) => {
  const [activeTab, setActiveTab] = useState('loan-scenario');
  const [isEditing, setIsEditing] = useState(false);
  const [editedLoan, setEditedLoan] = useState(selectedLoan);
  
  // Rehab budget items for Scope of Work tab
  const [rehabItems, setRehabItems] = useState<RehabItem[]>([
    { id: '1', category: 'Soft Costs', description: 'Permits', budgeted: 0, actual: 0 },
    { id: '2', category: 'Soft Costs', description: 'Impact Fees', budgeted: 0, actual: 0 },
    { id: '3', category: 'Soft Costs', description: 'Architectural', budgeted: 0, actual: 0 },
    { id: '4', category: 'Soft Costs', description: 'Engineering', budgeted: 0, actual: 0 },
    { id: '5', category: 'Soft Costs', description: 'Utility Impact Fees (such as new hookups)', budgeted: 0, actual: 0 },
    { id: '6', category: 'Site Work', description: 'Demolition', budgeted: 0, actual: 0 },
    { id: '7', category: 'Site Work', description: 'Site Preparation', budgeted: 0, actual: 0 },
    { id: '8', category: 'Site Work', description: 'Excavation', budgeted: 0, actual: 0 },
    { id: '9', category: 'Site Work', description: 'Foundation', budgeted: 0, actual: 0 },
    { id: '10', category: 'Site Work', description: 'Concrete/Flatwork', budgeted: 0, actual: 0 },
    { id: '11', category: 'Site Work', description: 'Septic', budgeted: 0, actual: 0 },
    { id: '12', category: 'Site Work', description: 'Well', budgeted: 0, actual: 0 },
    { id: '13', category: 'Site Work', description: 'Utilities', budgeted: 0, actual: 0 },
    { id: '14', category: 'Site Work', description: 'Landscaping', budgeted: 0, actual: 0 },
    { id: '15', category: 'Site Work', description: 'Driveway', budgeted: 0, actual: 0 },
    { id: '16', category: 'Structure', description: 'Framing', budgeted: 0, actual: 0 },
    { id: '17', category: 'Structure', description: 'Roofing', budgeted: 0, actual: 0 },
    { id: '18', category: 'Structure', description: 'Siding', budgeted: 0, actual: 0 },
    { id: '19', category: 'Structure', description: 'Windows', budgeted: 0, actual: 0 },
    { id: '20', category: 'Structure', description: 'Doors', budgeted: 0, actual: 0 },
    { id: '21', category: 'Structure', description: 'Insulation', budgeted: 0, actual: 0 },
    { id: '22', category: 'Structure', description: 'Drywall', budgeted: 0, actual: 0 },
    { id: '23', category: 'Mechanical', description: 'Plumbing', budgeted: 0, actual: 0 },
    { id: '24', category: 'Mechanical', description: 'Electrical', budgeted: 0, actual: 0 },
    { id: '25', category: 'Mechanical', description: 'HVAC', budgeted: 0, actual: 0 },
    { id: '26', category: 'Interior', description: 'Flooring', budgeted: 0, actual: 0 },
    { id: '27', category: 'Interior', description: 'Kitchen Cabinets', budgeted: 0, actual: 0 },
    { id: '28', category: 'Interior', description: 'Kitchen Countertops', budgeted: 0, actual: 0 },
    { id: '29', category: 'Interior', description: 'Kitchen Appliances', budgeted: 0, actual: 0 },
    { id: '30', category: 'Interior', description: 'Bathroom Vanities', budgeted: 0, actual: 0 },
    { id: '31', category: 'Interior', description: 'Bathroom Fixtures', budgeted: 0, actual: 0 },
    { id: '32', category: 'Interior', description: 'Bathroom Tile', budgeted: 0, actual: 0 },
    { id: '33', category: 'Interior', description: 'Interior Paint', budgeted: 0, actual: 0 },
    { id: '34', category: 'Interior', description: 'Trim/Molding', budgeted: 0, actual: 0 },
    { id: '35', category: 'Interior', description: 'Interior Doors', budgeted: 0, actual: 0 },
    { id: '36', category: 'Interior', description: 'Hardware', budgeted: 0, actual: 0 },
    { id: '37', category: 'Interior', description: 'Light Fixtures', budgeted: 0, actual: 0 },
    { id: '38', category: 'Exterior', description: 'Exterior Paint', budgeted: 0, actual: 0 },
    { id: '39', category: 'Exterior', description: 'Deck/Patio', budgeted: 0, actual: 0 },
    { id: '40', category: 'Exterior', description: 'Fence', budgeted: 0, actual: 0 },
    { id: '41', category: 'Exterior', description: 'Garage Door', budgeted: 0, actual: 0 },
    { id: '42', category: 'Other', description: 'Cleaning', budgeted: 0, actual: 0 },
    { id: '43', category: 'Other', description: 'Staging', budgeted: 0, actual: 0 },
    { id: '44', category: 'Other', description: 'Photography', budgeted: 0, actual: 0 },
    { id: '45', category: 'Other', description: 'Contingency', budgeted: 0, actual: 0 },
    { id: '46', category: 'Other', description: 'General Contractor', budgeted: 0, actual: 0 },
    { id: '47', category: 'Other', description: 'Other', budgeted: 0, actual: 0 }
  ]);

  // Additional work items for Scope of Work tab
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);

  // Entity members state
  const [entityMembers, setEntityMembers] = useState<EntityMember[]>([
    {
      id: '1',
      name: '',
      title: '',
      ownershipPercentage: 0,
      ssn: '',
      email: '',
      phone: ''
    }
  ]);

  // Guarantors state
  const [guarantors, setGuarantors] = useState<Guarantor[]>([
    {
      id: '1',
      name: '',
      ssn: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  ]);

  // Application form state
  const [applicationData, setApplicationData] = useState({
    // Entity Info
    entityName: '',
    entityType: 'LLC',
    entityState: '',
    entityAddress: '',
    entityCity: '',
    entityZip: '',
    taxId: '',
    
    // Property Info
    propertyAddress: '',
    propertyCity: '',
    propertyState: '',
    propertyZip: '',
    propertyType: 'Single Family',
    yearBuilt: '',
    squareFootage: '',
    bedrooms: '',
    bathrooms: '',
    
    // Insurance
    insuranceCompany: '',
    insuranceAgent: '',
    insurancePhone: '',
    insuranceEmail: '',
    
    // Title
    titleCompany: '',
    titleAgent: '',
    titlePhone: '',
    titleEmail: ''
  });

  // Progressive application state
  const [currentSection, setCurrentSection] = useState('scope-of-work');
  const [isSaving, setIsSaving] = useState(false);
  const [sectionStatus, setSectionStatus] = useState({
    'scope-of-work': 'pending',
    entity: 'pending',
    guarantors: 'pending',
    property: 'pending',
    insurance: 'pending',
    title: 'pending'
  });

  const sections = [
    { id: 'scope-of-work', title: 'Scope of Work', description: 'Project details & budget', step: 1 },
    { id: 'entity', title: 'Entity Information', description: 'Company details & members', step: 2 },
    { id: 'guarantors', title: 'Guarantors', description: 'Personal guarantors', step: 3 },
    { id: 'property', title: 'Property Information', description: 'Property details', step: 4 },
    { id: 'insurance', title: 'Insurance', description: 'Insurance provider info', step: 5 },
    { id: 'title', title: 'Title Company', description: 'Title company details', step: 6 }
  ];

  const completedSections = Object.values(sectionStatus).filter(status => status === 'completed').length;
  const progressPercentage = (completedSections / sections.length) * 100;

  const validateSection = (sectionId: string) => {
    switch (sectionId) {
      case 'entity':
        const entityValid = applicationData.entityName && 
                           applicationData.entityType && 
                           applicationData.entityState && 
                           applicationData.taxId &&
                           applicationData.entityAddress &&
                           applicationData.entityCity &&
                           applicationData.entityZip &&
                           entityMembers.every(member => 
                             member.name && member.title && member.ssn && member.email && member.phone
                           );
        return entityValid;
      
      case 'guarantors':
        return guarantors.every(guarantor => 
          guarantor.name && guarantor.ssn && guarantor.email && guarantor.phone &&
          guarantor.address && guarantor.city && guarantor.state && guarantor.zipCode
        );
      
      case 'property':
        return applicationData.propertyAddress && 
               applicationData.propertyCity && 
               applicationData.propertyState && 
               applicationData.propertyZip &&
               applicationData.propertyType;
      
      case 'insurance':
        return applicationData.insuranceCompany && 
               applicationData.insuranceAgent && 
               applicationData.insurancePhone && 
               applicationData.insuranceEmail;
      
      case 'title':
        return applicationData.titleCompany && 
               applicationData.titleAgent && 
               applicationData.titlePhone && 
               applicationData.titleEmail;
      
      default:
        return false;
    }
  };

  const saveSection = async (sectionId: string) => {
    if (!validateSection(sectionId)) {
      alert('Please fill in all required fields before saving.');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSectionStatus(prev => ({ ...prev, [sectionId]: 'completed' }));
    
    // Move to next section
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id);
    }
    
    setIsSaving(false);
  };

  const handleSaveEdit = () => {
    onUpdateLoan(editedLoan);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedLoan(selectedLoan);
    setIsEditing(false);
  };

  const addRehabItem = () => {
    const newItem: RehabItem = {
      id: Date.now().toString(),
      category: '',
      description: '',
      budgeted: 0,
      actual: 0
    };
    setRehabItems([...rehabItems, newItem]);
  };

  const updateRehabItem = (id: string, field: keyof RehabItem, value: string | number) => {
    setRehabItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteRehabItem = (id: string) => {
    setRehabItems(items => items.filter(item => item.id !== id));
  };

  const addWorkItem = () => {
    const newItem: WorkItem = {
      id: Date.now().toString(),
      description: '',
      budgeted: 0,
      actual: 0
    };
    setWorkItems([...workItems, newItem]);
  };

  const updateWorkItem = (id: string, field: keyof WorkItem, value: string | number) => {
    setWorkItems(items => 
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteWorkItem = (id: string) => {
    setWorkItems(items => items.filter(item => item.id !== id));
  };

  const addEntityMember = () => {
    const newMember: EntityMember = {
      id: Date.now().toString(),
      name: '',
      title: '',
      ownershipPercentage: 0,
      ssn: '',
      email: '',
      phone: ''
    };
    setEntityMembers([...entityMembers, newMember]);
  };

  const updateEntityMember = (id: string, field: keyof EntityMember, value: string | number) => {
    setEntityMembers(members => 
      members.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const deleteEntityMember = (id: string) => {
    if (entityMembers.length > 1) {
      setEntityMembers(members => members.filter(member => member.id !== id));
    }
  };

  const addGuarantor = () => {
    const newGuarantor: Guarantor = {
      id: Date.now().toString(),
      name: '',
      ssn: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    };
    setGuarantors([...guarantors, newGuarantor]);
  };

  const updateGuarantor = (id: string, field: keyof Guarantor, value: string) => {
    setGuarantors(guarantors => 
      guarantors.map(guarantor => 
        guarantor.id === id ? { ...guarantor, [field]: value } : guarantor
      )
    );
  };

  const deleteGuarantor = (id: string) => {
    if (guarantors.length > 1) {
      setGuarantors(guarantors => guarantors.filter(guarantor => guarantor.id !== id));
    }
  };

  const updateApplicationData = (field: string, value: string) => {
    setApplicationData(prev => ({ ...prev, [field]: value }));
  };

  const totalBudgeted = rehabItems.reduce((sum, item) => sum + item.budgeted, 0) + 
                       workItems.reduce((sum, item) => sum + item.budgeted, 0);
  const totalActual = rehabItems.reduce((sum, item) => sum + item.actual, 0) + 
                     workItems.reduce((sum, item) => sum + item.actual, 0);

  const groupedRehabItems = rehabItems.reduce((groups, item) => {
    const category = item.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, RehabItem[]>);

  const renderLoanScenario = () => (
    <div className="space-y-6">
      {/* Pizza Tracker */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Loan Progress</h3>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[
            { step: 1, label: 'Pricing', sublabel: 'Rate and terms calculated', active: true },
            { step: 2, label: 'Application Submission', sublabel: 'Submit loan application', active: false },
            { step: 3, label: 'Scope of Work Review', sublabel: 'Review project details', active: false },
            { step: 4, label: 'Processing', sublabel: 'Document verification', active: false },
            { step: 5, label: 'Underwriting and QC', sublabel: 'Final loan approval', active: false },
            { step: 6, label: 'Clear to Close', sublabel: 'Ready for closing', active: false },
            { step: 7, label: 'Funded', sublabel: 'Loan funds disbursed', active: false }
          ].map((item, index) => (
            <div key={item.step} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mb-2 ${
                item.active ? 'bg-teal-600' : 'bg-gray-300'
              }`}>
                {item.step}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-500 max-w-20">{item.sublabel}</div>
              </div>
              {index < 6 && (
                <div className="absolute h-0.5 bg-gray-300 w-16 mt-6 ml-16 hidden lg:block"></div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Stage 1 of 7: Pricing</span>
            <span className="text-sm font-medium text-teal-600">14% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-teal-600 h-2 rounded-full" style={{ width: '14%' }}></div>
          </div>
        </div>
      </div>

      {/* Loan Terms */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Loan Terms</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-teal-600 hover:text-teal-700 font-medium"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan to Cost</label>
                <input
                  type="text"
                  value={editedLoan.loanToCost}
                  onChange={(e) => setEditedLoan({...editedLoan, loanToCost: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                <input
                  type="text"
                  value={editedLoan.loanAmount}
                  onChange={(e) => setEditedLoan({...editedLoan, loanAmount: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
                <input
                  type="text"
                  value={editedLoan.rate}
                  onChange={(e) => setEditedLoan({...editedLoan, rate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origination Fee</label>
                <input
                  type="text"
                  value={editedLoan.originationFee}
                  onChange={(e) => setEditedLoan({...editedLoan, originationFee: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Payment</label>
                <input
                  type="text"
                  value={editedLoan.payment}
                  onChange={(e) => setEditedLoan({...editedLoan, payment: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Term</label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>12 months</option>
                  <option>18 months</option>
                  <option>24 months</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveEdit}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Loan to Cost</p>
              <p className="text-lg font-medium text-gray-900">{selectedLoan.loanToCost}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Loan Amount</p>
              <p className="text-lg font-medium text-gray-900">{selectedLoan.loanAmount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Interest Rate</p>
              <p className="text-lg font-medium text-gray-900">{selectedLoan.rate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Origination Fee</p>
              <p className="text-lg font-medium text-gray-900">{selectedLoan.originationFee}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Monthly Payment</p>
              <p className="text-lg font-medium text-gray-900">{selectedLoan.payment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Loan Term</p>
              <p className="text-lg font-medium text-gray-900">12 months</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderApplication = () => (
    <div className="space-y-6">
      {/* Entity Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Entity Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
            <input
              type="text"
              value={applicationData.entityName}
              onChange={(e) => updateApplicationData('entityName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter entity name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
            <select
              value={applicationData.entityType}
              onChange={(e) => updateApplicationData('entityType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="LLC">LLC</option>
              <option value="Corporation">Corporation</option>
              <option value="Partnership">Partnership</option>
              <option value="Individual">Individual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State of Formation</label>
            <input
              type="text"
              value={applicationData.entityState}
              onChange={(e) => updateApplicationData('entityState', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / EIN</label>
            <input
              type="text"
              value={applicationData.taxId}
              onChange={(e) => updateApplicationData('taxId', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Tax ID"
            />
          </div>
        </div>
      </div>

      {/* Property Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Property Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
            <input
              type="text"
              value={applicationData.propertyAddress}
              onChange={(e) => updateApplicationData('propertyAddress', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Street address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={applicationData.propertyCity}
              onChange={(e) => updateApplicationData('propertyCity', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={applicationData.propertyState}
              onChange={(e) => updateApplicationData('propertyState', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="State"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              value={applicationData.propertyType}
              onChange={(e) => updateApplicationData('propertyType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Single Family">Single Family</option>
              <option value="Duplex">Duplex</option>
              <option value="Triplex">Triplex</option>
              <option value="Fourplex">Fourplex</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScopeOfWork = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Scope of Work</h3>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Documents</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Loan Options
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Loan Summary</h1>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {[
            { id: 'loan-scenario', label: 'Loan Scenario' },
            { id: 'application', label: 'Application' },
            { id: 'documents', label: 'Documents' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Content */}
        <div>
          {activeTab === 'loan-scenario' && renderLoanScenario()}
          {activeTab === 'application' && renderApplication()}
          {activeTab === 'scope-of-work' && renderScopeOfWork()}
          {activeTab === 'documents' && renderDocuments()}
        </div>
      </div>
    </div>
  );
};

export default LoanSummary;