import supabase from '../../supabaseClient';

export interface UserRole {
  id: string;
  email: string;
  role: 'Fan' | 'Coach' | 'Admin';
  google_id?: string;
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, google_id')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data as UserRole;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
}

export async function updateUserRole(userId: string, role: 'Fan' | 'Coach' | 'Admin'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return false;
  }
}

export async function isCoach(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole?.role === 'Coach';
}

export async function isFan(userId: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole?.role === 'Fan';
}

export async function checkUserExists(email: string): Promise<{ exists: boolean; role?: 'Fan' | 'Coach' | 'Admin' }> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error checking if user exists:', error);
      return { exists: false };
    }

    return { 
      exists: !!data, 
      role: data?.role as 'Fan' | 'Coach' | 'Admin' | undefined 
    };
  } catch (error) {
    console.error('Error in checkUserExists:', error);
    return { exists: false };
  }
}

export async function isAdminEligible(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_whitelist')
      .select('email')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error checking admin eligibility:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isAdminEligible:', error);
    return false;
  }
}

export async function addAdminToWhitelist(email: string, addedBy: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_whitelist')
      .insert({
        email,
        added_by: addedBy,
        is_active: true,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error adding admin to whitelist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addAdminToWhitelist:', error);
    return false;
  }
}

export async function removeAdminFromWhitelist(email: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_whitelist')
      .update({ is_active: false })
      .eq('email', email);

    if (error) {
      console.error('Error removing admin from whitelist:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeAdminFromWhitelist:', error);
    return false;
  }
}

export async function getAdminWhitelist(): Promise<Array<{email: string, added_by: string, created_at: string, is_active: boolean}>> {
  try {
    const { data, error } = await supabase
      .from('admin_whitelist')
      .select('email, added_by, created_at, is_active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin whitelist:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAdminWhitelist:', error);
    return [];
  }
}

export async function createUserProfile(userId: string, email: string, role: 'Fan' | 'Coach' | 'Admin' = 'Fan'): Promise<boolean> {
  try {
    // First check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing user:', checkError);
      return false;
    }

    let userError;
    if (existingUser) {
      // Update existing user with role
      console.log('Updating existing user with role:', role);
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
      userError = error;
    } else {
      // Insert new user
      console.log('Creating new user with role:', role);
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          role
        });
      userError = error;
    }

    if (userError) {
      console.error('Error creating/updating user:', userError);
      return false;
    }

    // Insert or update user_profiles table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        display_name: email.split('@')[0] // Use email prefix as display name
      });

    if (profileError) {
      console.error('Error creating/updating user profile:', profileError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return false;
  }
}
