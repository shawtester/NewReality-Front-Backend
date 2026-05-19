'use server';

// Helper to format Date to "DD/MM/YYYY" in India Standard Time (IST)
function getFormattedDate() {
  try {
    const options = { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    // en-GB returns DD/MM/YYYY by default
    return formatter.format(new Date());
  } catch (e) {
    // Fallback if Intl fails
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export async function submitLeadToCRM(leadData) {
  try {
    const {
      name = '',
      email = '',
      phone = '',
      countryCode = '+91',
      propertyTitle = '',
      source = '',
      message = '',
      loanAmount = null,
      interestRate = null,
      tenure = null,
      utmData = {},
    } = leadData;

    // 1. Split Name safely into FirstName and LastName
    const cleanName = name.trim();
    const spaceIndex = cleanName.indexOf(' ');
    let firstName = cleanName;
    let lastName = '';
    if (spaceIndex !== -1) {
      firstName = cleanName.substring(0, spaceIndex).trim();
      lastName = cleanName.substring(spaceIndex + 1).trim();
    }

    // 2. Clean Phone Number - Extract only the digits
    const cleanPhone = phone.replace(/\D/g, '');
    let mobile = cleanPhone;
    
    // If the phone already includes dial code or is longer than 10 digits,
    // let's grab the last 10 digits as the mobile number to match standard CRM entries
    if (mobile.length > 10) {
      mobile = cleanPhone.slice(-10);
    }

    // 3. Dial Code - Extract digits from countryCode (defaults to 91)
    const dialCodeNum = parseInt(countryCode.replace(/\D/g, ''), 10) || 91;

    // 4. Format Current Date as DD/MM/YYYY
    const createdDate = getFormattedDate();

    // 5. Build detailed Remark based on the context/source
    let remark = message ? message.trim() : '';
    if (source === 'EMI Calculator Popup' && loanAmount) {
      remark = `EMI Calculator Inquiry - Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}, Interest: ${interestRate}%, Tenure: ${tenure} yrs. ${remark}`.trim();
    } else if (source === 'brochure-download' || source === 'property-card' || source === 'property-detail' || source === 'get-in-touch-modal') {
      const actionName = source === 'brochure-download' ? 'Brochure Download' : 'Inquiry';
      remark = `${actionName} for "${propertyTitle}". ${remark}`.trim();
    } else {
      if (propertyTitle) {
        remark = `Inquiry for "${propertyTitle}". ${remark}`.trim();
      }
    }

    // 6. Build the payload matching the exact BUILDESK-CRM API specification
    const payload = {
      ApiKey: "19456d71-0a7a-43ce-bc46-238aa87cdcee",
      UserId: null,
      UID: null,
      FirstName: firstName || 'Visitor',
      LastName: lastName || '',
      DialCode: dialCodeNum,
      Platform: "website",
      SubSource: source || 'Direct',
      Mobile: mobile || '',
      SecondaryNumber: "",
      CreatedDate: createdDate,
      Email: email.trim().toLowerCase(),
      Remark: remark || 'Lead captured from website form.',
      VisitDate: null,
      ProjectUID: null,
      ProjectName: propertyTitle || 'Neev Realty',
      CampaignUID: "",
      Campaign: "",
      CampaignChannel: "",
      CampaignChannelUID: "",
      City: "Gurgaon",
      MinBudget: 0,
      MaxBudget: 0,
      EmploymentType: "",
      Income: 0,
      Designation: "",
      UtmCampaign: utmData.utm_campaign || "",
      UtmMedium: utmData.utm_medium || "",
      UtmSource: utmData.utm_source || "",
      UtmTerm: utmData.utm_term || "",
      GCLId: utmData.gclid || "",
      FbId: utmData.fbclid || "",
      UtmContent: utmData.utm_content || ""
    };

    console.log('--- Submitting Lead to BUILDESK-CRM ---');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://buildeskapi.azurewebsites.net/api/buildeskapi/campaignlead/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('CRM API Response:', responseData);

    return {
      success: responseData.Success || false,
      message: responseData.Message || 'Lead captured successfully',
      data: responseData
    };
  } catch (error) {
    console.error('❌ Error submitting lead to BUILDESK-CRM:', error);
    return {
      success: false,
      message: error.message || 'CRM Submission Failed'
    };
  }
}
