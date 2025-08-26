// Single donor / contributor
export interface Donor {
  address: string;   // donor’s address
  amount: string;    // amount they contributed (on-chain often stored as string)
}

// Campaign structure (from Move resource)
export interface Campaign {
  creator: string;           // address of campaign creator
  name: string;              // campaign title
  description: string;       // campaign details
  goal_amount: string;       // target goal (big number, keep as string then convert)
  current_amount: string;    // raised amount so far
  deadline: string;          // unix timestamp (as string)
  category?: string;         // optional, if you added
  donors?: Donor[];          // optional array of donors
  contributors?: Donor[];    // optional contributors list
}

// Platform resource
export interface CrowdfundingPlatform {
  campaigns: {
    handle: string; // the table handle for campaigns
  };
}
