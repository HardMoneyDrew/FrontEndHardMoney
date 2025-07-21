import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Check, Info } from 'lucide-react';
import LoanSummary from './components/LoanSummary';

interface LoanOption {
  loanToCost: string;
  loanAmount: string;
  rate: string;
  originationFee: string;
  payment: string;
}

function Calculator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transactionType: 'Purchase',
    product: 'Fix & Flip / Bridge',
    propertyState: 'FL',
    ficoScore: 'Over 780',
    currentlyOwnedRentals: '',
    fixFlipExits: '',
    groundUpExits: '',
    refinance: 'No',
    propertyOwned24Months: 'No',
    previouslyCompletedRehab: '0',
    purchasePrice: '200,000',
    totalLoanAmount: '150,000',
    estimatedRehabCost: '25,000',
    afterRepairValue: '300,000',
    loanTerm: '12',
    reduceOriginationFee: '',
    reduceRateFee: ''
  });

  const [calculated, setCalculated] = useState(false);
  const [loanOptions, setLoanOptions] = useState<LoanOption[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<LoanOption | null>(null);

  useEffect(() => {
    // Simulate calculation
    const timer = setTimeout(() => {
      setCalculated(true);
      
      const purchasePrice = parseInt(formData.purchasePrice.replace(/,/g, '')) || 0;
      const rehabCost = parseInt(formData.estimatedRehabCost.replace(/,/g, '')) || 0;
      const totalCost = purchasePrice + rehabCost;
      
      const loan95 = Math.floor(totalCost * 0.95);
      const loan90 = Math.floor(totalCost * 0.90);
      const loan85 = Math.floor(totalCost * 0.85);
      
      // Calculate origination fees based on Interest on Undrawn selection
      const feeAdjustment = 0; // Remove Dutch interest adjustment
      
      // Calculate fee and rate adjustments based on reduce rate/fee selection
      let feeReduction = 0;
      let rateReduction = 0;
      let rateIncrease = 0;
     let feeIncrease = 0;
      
      // Handle origination fee reduction
      switch (formData.reduceOriginationFee) {
        case '0.167% Reduced Fee':
          feeReduction += 0.167;
          rateIncrease += 0.25; // 0.25% higher rate for 0.167% less fee (2:3 ratio)
          break;
        case '0.333% Reduced Fee':
          feeReduction += 0.333;
          rateIncrease += 0.5; // 0.5% higher rate for 0.333% less fee (2:3 ratio)
          break;
        case '0.5% Reduced Fee':
          feeReduction += 0.5;
          rateIncrease += 0.75; // 0.75% higher rate for 0.5% less fee (2:3 ratio)
          break;
        default:
          break;
      }
      
     // Handle interest rate reduction
      switch (formData.reduceRateFee) {
        case '0.5% Reduced Interest':
          rateReduction = 0.5;
         feeIncrease = 0.333; // 0.333% higher fee for 0.5% less rate (3:2 ratio)
          break;
        case '1% Reduced Interest':
          rateReduction = 1.0;
         feeIncrease = 0.667; // 0.667% higher fee for 1% less rate (3:2 ratio)
          break;
        default:
          rateReduction = 0;
         feeIncrease = 0;
      }
      
      const baseRate = 10.75;
      const adjustedRate = baseRate + rateIncrease - rateReduction;
      
      setLoanOptions([
        { 
          loanToCost: '95% LTC', 
          loanAmount: `$${loan95.toLocaleString()}`,
          rate: `${adjustedRate.toFixed(2)}%`, 
         originationFee: `${Math.max(0, (1.5 + feeAdjustment - feeReduction + feeIncrease)).toFixed(3)}%`, 
          payment: `$${Math.floor(loan95 * (adjustedRate / 100) / 12).toLocaleString()}` 
        },
        { 
          loanToCost: '90% LTC', 
          loanAmount: `$${loan90.toLocaleString()}`,
          rate: `${adjustedRate.toFixed(2)}%`, 
         originationFee: `${Math.max(0, (1.25 + feeAdjustment - feeReduction + feeIncrease)).toFixed(3)}%`, 
          payment: `$${Math.floor(loan90 * (adjustedRate / 100) / 12).toLocaleString()}` 
        },
        { 
          loanToCost: '85% LTC', 
          loanAmount: `$${loan85.toLocaleString()}`,
          rate: `${adjustedRate.toFixed(2)}%`, 
         originationFee: `${Math.max(0, (1.0 + feeAdjustment - feeReduction + feeIncrease)).toFixed(3)}%`, 
          payment: `$${Math.floor(loan85 * (adjustedRate / 100) / 12).toLocaleString()}` 
        }
      ]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setCalculated(false);
  };

  const purchasePrice = parseInt(formData.purchasePrice.replace(/,/g, '')) || 0;
  const rehabCost = parseInt(formData.estimatedRehabCost.replace(/,/g, '')) || 0;
  const previouslyCompletedRehab = parseInt(formData.previouslyCompletedRehab.replace(/,/g, '')) || 0;
  
  // For refinance: include previously completed rehab regardless of ownership duration
  // For purchase: just purchase price + rehab cost
  const totalCost = formData.refinance === 'Yes' 
    ? purchasePrice + rehabCost + previouslyCompletedRehab
    : purchasePrice + rehabCost;
  const maxLoanAmount = Math.floor(totalCost * 0.95); // 95% LTC
  const minLoanAmount = 50000;
  const currentLoanAmount = parseInt(formData.totalLoanAmount.replace(/,/g, '')) || minLoanAmount;
  
  const afterRepairValue = parseInt(formData.afterRepairValue.replace(/,/g, '')) || 0;
  const loanToValue = afterRepairValue > 0 ? ((currentLoanAmount / afterRepairValue) * 100).toFixed(2) : '0';

  // Calculate viability ratio and check if project is viable
  const viabilityRatio = totalCost > 0 ? afterRepairValue / totalCost : 0;
  const getViabilityStatus = () => {
    let minRatio = 1.2; // Default for most products
    if (formData.product === 'Ground-Up Construction') {
      minRatio = 1.25;
    }
    
    if (viabilityRatio < minRatio) {
      return { isViable: false, message: 'Not a Viable Project!', color: 'text-red-500' };
    } else {
      return { isViable: true, message: '', color: 'text-green-600' };
    }
  };
  const viabilityStatus = getViabilityStatus();

  const handleChooseLoan = (loan: LoanOption) => {
    setSelectedLoan(loan);
    navigate('/loan-summary', { state: { selectedLoan: loan, formData } });
  };

  // Calculate borrower tier based on credit and experience
  const getCreditTier = (ficoScore: string) => {
    if (ficoScore === 'Over 780') return 'Tier 1';
    if (ficoScore === '740-779') return 'Tier 2';
    if (ficoScore === '720-739') return 'Tier 3';
    if (ficoScore === '700-719') return 'Tier 4';
    if (ficoScore === '680-699') return 'Tier 5';
    if (ficoScore === '660-679') return 'Tier 6';
    if (ficoScore === '620-639') return 'Tier 7';
    if (ficoScore === '600-619') return 'Tier 8';
    return 'Tier 9';
  };

  const getBuilderExperience = (groundUpExits: number) => {
    if (groundUpExits === 0) return 'New Builder (0)';
    if (groundUpExits <= 2) return 'Experienced Builder (1-2)';
    return 'Professional Builder (3+)';
  };

  const getInvestorExperience = (fixFlipExits: number) => {
    if (fixFlipExits === 0) return 'New Investor (0)';
    if (fixFlipExits <= 2) return 'Beginner (1-2)';
    if (fixFlipExits <= 5) return 'Experienced (3-5)';
    return 'Professional (6+)';
  };

  const getBorrowerTier = () => {
    const creditTier = getCreditTier(formData.ficoScore);
    const groundUpExits = parseInt(formData.groundUpExits) || 0;
    const fixFlipExits = parseInt(formData.fixFlipExits) || 0;
    const currentlyOwnedRentals = parseInt(formData.currentlyOwnedRentals) || 0;
    const totalExperience = currentlyOwnedRentals + fixFlipExits + groundUpExits;
    
    if (formData.product === 'Ground-Up Construction') {
      const builderExp = getBuilderExperience(groundUpExits);
      const investorExp = getInvestorExperience(fixFlipExits);
      return `Credit (${creditTier}) | ${builderExp} | ${investorExp}`;
    } else {
      const investorExp = getInvestorExperience(fixFlipExits);
      return `Credit (${creditTier}) | ${investorExp}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute top-0 right-0 h-96 w-96 text-blue-500" fill="currentColor" viewBox="0 0 100 100">
          <polygon points="0,0 100,0 100,100" />
        </svg>
        <svg className="absolute bottom-0 right-0 h-64 w-64 text-blue-500" fill="currentColor" viewBox="0 0 100 100">
          <polygon points="0,100 100,0 100,100" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Estimate Your Bridge Rate</h1>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Property Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Product</label>
                    <div className="relative">
                      <select 
                        value={formData.product}
                        onChange={(e) => handleInputChange('product', e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Fix & Flip">Fix & Flip</option>
                        <option value="Bridge">Bridge</option>
                        <option value="Ground-Up Construction">Ground-Up Construction</option>
                        <option value="Rental Loan">Rental Loan</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Property State</label>
                    <div className="relative">
                      <select 
                        value={formData.propertyState}
                        onChange={(e) => handleInputChange('propertyState', e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="FL">FL</option>
                        <option value="CA">CA</option>
                        <option value="TX">TX</option>
                        <option value="NY">NY</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Refinance</label>
                    <div className="relative">
                      <select 
                        value={formData.refinance}
                        onChange={(e) => handleInputChange('refinance', e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {formData.refinance === 'Yes' && (
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Property owned &gt;24 mo?</label>
                      <div className="relative">
                        <select 
                          value={formData.propertyOwned24Months}
                          onChange={(e) => handleInputChange('propertyOwned24Months', e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    {formData.propertyOwned24Months === 'No' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Previously Completed Rehab</label>
                        <div className="relative">
                          <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                          <input
                            type="text"
                            value={formData.previouslyCompletedRehab}
                            onChange={(e) => handleInputChange('previouslyCompletedRehab', e.target.value)}
                            className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {formData.refinance === 'Yes' && formData.propertyOwned24Months === 'Yes' ? 'As-is Value' : 
                         formData.refinance === 'Yes' ? 'Original Purchase Price' : 'Purchase Price'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={formData.purchasePrice}
                          onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                          className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Cost of Rehab</label>
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={formData.estimatedRehabCost}
                          onChange={(e) => handleInputChange('estimatedRehabCost', e.target.value)}
                          className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center">
                        After Repair Value (ARV)
                        <Info className="ml-1 h-3 w-3 text-gray-400" />
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                        <input
                          type="text"
                          value={formData.afterRepairValue}
                          onChange={(e) => handleInputChange('afterRepairValue', e.target.value)}
                          className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Total Project Cost</label>
                      <div className="p-2 text-sm border border-gray-200 rounded-md bg-gray-50">
                        ${totalCost.toLocaleString()}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Gross Profit</label>
                      <div className="p-2 text-sm border border-gray-200 rounded-md bg-gray-50">
                        ${(afterRepairValue - (purchasePrice + rehabCost)).toLocaleString()}
                      </div>
                     <div className={`text-xs mt-0.5 ${viabilityStatus.color} ${!viabilityStatus.isViable ? 'font-medium' : ''}`}>
                       Viability Ratio: {viabilityRatio.toFixed(2)}
                       {!viabilityStatus.isViable && (
                         <span className="block">{viabilityStatus.message}</span>
                       )}
                     </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">Borrower Information</h2>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Est. FICO Score</label>
                      <div className="relative">
                        <select 
                          value={formData.ficoScore}
                          onChange={(e) => handleInputChange('ficoScore', e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="Over 780">Over 780</option>
                          <option value="740-779">740-779</option>
                          <option value="700-739">700-739</option>
                          <option value="660-699">660-699</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Currently Owned Rentals</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.currentlyOwnedRentals}
                        onChange={(e) => handleInputChange('currentlyOwnedRentals', e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Fix & Flip Exits (Last 24 Months)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.fixFlipExits}
                        onChange={(e) => handleInputChange('fixFlipExits', e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Ground-Up Exits (Last 24 Months)</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.groundUpExits}
                        onChange={(e) => handleInputChange('groundUpExits', e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Total Experience:</span>
                      <span className="ml-2 text-base font-semibold text-teal-600">
                        {(parseInt(formData.currentlyOwnedRentals) || 0) + 
                         (parseInt(formData.fixFlipExits) || 0) + 
                         (parseInt(formData.groundUpExits) || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {getBorrowerTier()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {calculated ? (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-3">
                Based on your provided information, you've qualified for the following options:
              </p>
              
              <div className="space-y-4">
                {loanOptions.map((option, index) => {
                  const isHighestLeverage = option.loanToCost === '95% LTC';
                  const isLowestFee = option.loanToCost === '85% LTC';
                  
                  return (
                    <div key={index} className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {/* Highlight badge */}
                      {(isHighestLeverage || isLowestFee) && (
                        <div className={`px-4 py-2 ${isHighestLeverage ? 'bg-blue-50' : 'bg-green-50'}`}>
                          <span className={`text-sm font-medium ${isHighestLeverage ? 'text-blue-800' : 'text-green-800'}`}>
                            {isHighestLeverage ? 'HIGHEST LEVERAGE' : 'LOWEST FEE'}
                          </span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-6 gap-4 p-4 items-center">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Loan to Cost</p>
                          <p className="font-medium text-gray-900">{option.loanToCost}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Loan Amount</p>
                          <p className="font-medium text-gray-900">{option.loanAmount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Rate</p>
                          <p className="font-medium text-gray-900">{option.rate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Origination Fee</p>
                          <p className="font-medium text-gray-900">{option.originationFee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Est. Monthly Payment</p>
                          <p className="font-medium text-gray-900">{option.payment}</p>
                        </div>
                        <div className="text-right">
                          <button 
                            onClick={() => handleChooseLoan(option)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                          >
                            Choose
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
            </div>
          ) : null}
          
          {/* Loan Options Section - Moved to Bottom */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Loan Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Loan Term</label>
                <div className="relative">
                  <select 
                    value={formData.loanTerm}
                    onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="6">6 months</option>
                    <option value="9">9 months</option>
                    <option value="12">12 months</option>
                    <option value="15">15 months</option>
                    <option value="18">18 months</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Vanishing Points</label>
                <div className="relative">
                  <select 
                    value={formData.reduceOriginationFee}
                    onChange={(e) => handleInputChange('reduceOriginationFee', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select an option</option>
                    <option value="0.167% Reduced Fee">0.167% Reduced Fee</option>
                    <option value="0.333% Reduced Fee">0.333% Reduced Fee</option>
                    <option value="0.5% Reduced Fee">0.5% Reduced Fee</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buy Down Interest Rate</label>
                <div className="relative">
                  <select 
                    value={formData.reduceRateFee}
                    onChange={(e) => handleInputChange('reduceRateFee', e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select an option</option>
                    <option value="0.5% Reduced Interest">0.5% Reduced Interest</option>
                    <option value="1% Reduced Interest">1% Reduced Interest</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Need a custom loan amount? Call <span className="font-medium">(863) 276-1220</span>
        </p>
      </div>
    </div>
  );
}

function LoanSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLoan, formData } = location.state || {};

  if (!selectedLoan || !formData) {
    navigate('/');
    return null;
  }

  const handleBack = () => {
    navigate('/');
  };

  const handleUpdateLoan = (updatedLoan: LoanOption) => {
    // Handle loan updates here
    console.log('Updated loan:', updatedLoan);
  };

  return (
    <LoanSummary
      selectedLoan={selectedLoan}
      formData={formData}
      onBack={handleBack}
      onUpdateLoan={handleUpdateLoan}
    />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/loan-summary" element={<LoanSummaryPage />} />
      </Routes>
    </Router>
  );
}

export default App;