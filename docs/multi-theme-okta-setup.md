# Multi-Theme Okta Setup Guide

This guide explains how to configure Okta to support multiple business themes (Chocolate, Tech, Travel) with proper authorization and permissions.

## Overview

The demo platform supports three themes, each requiring separate Okta groups and authorization servers to demonstrate proper identity governance.

## Theme Configurations

### 1. **Chocolate Theme** (Sugar & Gold Treats)
- **Group Prefix:** `Sugar & Gold Treats`
- **Data Source:** `backend/data/initial_data.json`
- **Industry:** Confectionery

### 2. **Tech Theme** (TechPro Solutions)
- **Group Prefix:** `TechPro`
- **Data Source:** `backend/data/tech-data.json`
- **Industry:** Technology

### 3. **Travel Theme** (Wanderlust Travel Co)
- **Group Prefix:** `Wanderlust`
- **Data Source:** `backend/data/travel-data.json`
- **Industry:** Travel & Tourism

---

## Okta Group Setup

### Required Groups for Each Theme

Create the following groups in Okta Admin Console → Directory → Groups:

#### Chocolate Theme Groups
```
Sugar & Gold Treats-Sales
Sugar & Gold Treats-Warehouse
Sugar & Gold Treats-Finance
```

#### Tech Theme Groups
```
TechPro-Sales
TechPro-Warehouse
TechPro-Finance
```

#### Travel Theme Groups
```
Wanderlust-Sales
Wanderlust-Warehouse
Wanderlust-Finance
```

### Group Permissions Mapping

| Role | Agent Access |
|------|-------------|
| **Sales** | Sales (full), Inventory (read), Customer (full), Pricing (read) |
| **Warehouse** | Inventory (full) |
| **Finance** | Pricing (full) |

---

## Authorization Server Setup (Optional)

For full multi-tenant demonstration, create separate authorization servers:

### Option 1: Single Auth Server (Simpler)
Use one authorization server with all group-based policies:
- **Name:** Demo Platform API
- **Audience:** `api://demo-platform`
- **Scopes:** `inventory:read`, `inventory:write`, `sales:read`, `sales:write`, etc.

### Option 2: Multi Auth Server (Full Demo)
Create separate authorization servers for each theme:

#### Chocolate Auth Server
- **Name:** Sugar & Gold Treats API
- **Audience:** `api://sugar-gold-treats`
- **Description:** Chocolate sales API

#### Tech Auth Server
- **Name:** TechPro API
- **Audience:** `api://techpro`
- **Description:** Technology sales API

#### Travel Auth Server
- **Name:** Wanderlust API
- **Audience:** `api://wanderlust`
- **Description:** Travel booking API

---

## Access Policies & Rules

### Policy Template (Per Theme)

**Policy Name:** `[Theme] Agent Access Policy`

**Rules:**

1. **Sales Team Rule**
   - Groups: `[Prefix]-Sales`
   - Scopes: `sales:read`, `sales:write`, `inventory:read`, `customer:read`, `customer:write`, `pricing:read`

2. **Warehouse Team Rule**
   - Groups: `[Prefix]-Warehouse`
   - Scopes: `inventory:read`, `inventory:write`

3. **Finance Team Rule**
   - Groups: `[Prefix]-Finance`
   - Scopes: `pricing:read`, `pricing:write`

---

## User Assignment

### Test Users Setup

Create test users and assign to appropriate groups:

#### Example: Sarah Sales (Chocolate)
- **Email:** `sarah.sales@sugar-gold-treats.demo`
- **Groups:** `Sugar & Gold Treats-Sales`
- **Access:** Can view chocolate products, manage customers, read pricing

#### Example: Tom Tech (Technology)
- **Email:** `tom.tech@techpro.demo`
- **Groups:** `TechPro-Sales`
- **Access:** Can view technology products, manage tech customers, read pricing

#### Example: Wendy Wanderlust (Travel)
- **Email:** `wendy@wanderlust.demo`
- **Groups:** `Wanderlust-Sales`
- **Access:** Can view travel packages, manage travel customers, read pricing

---

## Backend Integration

### API Theme Detection

The backend should detect the theme from:
1. **Request header:** `X-Theme: chocolate|tech|travel`
2. **User groups:** Parse group prefix from Okta groups claim
3. **Default:** Fall back to chocolate theme

### Data Routing

```python
def get_data_for_theme(theme: str):
    data_files = {
        'chocolate': 'backend/data/initial_data.json',
        'tech': 'backend/data/tech-data.json',
        'travel': 'backend/data/travel-data.json',
    }
    return load_json(data_files.get(theme, data_files['chocolate']))
```

### Token Exchange Flow

1. Frontend sends theme context in API request
2. Backend validates user's Okta groups match theme
3. Token exchange requests scopes for appropriate auth server
4. MCP servers receive theme-specific data context

---

## Frontend Theme Switching

### How It Works

1. User clicks theme selector dropdown
2. Selected theme saved to localStorage
3. Page reloads with new theme
4. All UI elements update (branding, colors, questions)
5. User's Okta groups should match selected theme for full access

### Storage Keys

```typescript
localStorage.setItem('demo-platform-theme', 'chocolate|tech|travel');
```

---

## Testing the Setup

### Verification Checklist

- [ ] All groups created in Okta
- [ ] Test users assigned to appropriate groups
- [ ] Authorization servers configured (if using multi-server)
- [ ] Access policies and rules created
- [ ] Frontend theme switcher functional
- [ ] Backend serves correct data per theme
- [ ] Token exchanges show correct scopes per theme
- [ ] User identity card displays correct groups

### Test Scenarios

1. **Theme Switch Test**
   - Sign in as user in Chocolate group
   - Switch to Tech theme
   - Verify group mismatch message or limited access

2. **Full Access Test**
   - Sign in as user in Tech group
   - Select Tech theme
   - Verify all features accessible

3. **Cross-Theme Test**
   - Sign in as user in multiple theme groups
   - Switch between themes
   - Verify access changes appropriately

---

## Troubleshooting

### Issue: Groups Not Showing
- **Solution:** Add groups claim to ID token in Okta app
- **Path:** Applications → Your App → Sign On → OpenID Connect ID Token → Add groups claim

### Issue: Theme Not Persisting
- **Solution:** Check browser localStorage not blocked
- **Command:** `localStorage.getItem('demo-platform-theme')`

### Issue: Wrong Data Showing
- **Solution:** Backend not detecting theme correctly
- **Fix:** Check API request headers include theme context

---

## Production Considerations

### Security Notes

1. **Theme Isolation:** In production, use separate tenants or stricter RBAC
2. **Data Segregation:** Ensure theme data is properly isolated at database level
3. **Audit Logging:** Log all theme switches and cross-theme access attempts
4. **Group Validation:** Backend must validate user groups match requested theme

### Scalability

- Consider caching theme configurations
- Use database-driven theme configs instead of hardcoded
- Implement theme-specific rate limiting
- Monitor cross-theme access patterns

---

## Summary

This multi-theme setup demonstrates:
- ✅ Dynamic UI branding per business context
- ✅ Group-based authorization with Okta
- ✅ Theme-specific data and permissions
- ✅ Real-world multi-tenant patterns
- ✅ Identity governance across business units

Perfect for demonstrating Okta's capabilities in managing access across different business contexts!
