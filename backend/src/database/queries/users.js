import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

export async function createUser(userData) {
  const { email, name, company } = userData;

  try {
    const userId = crypto.randomUUID();
    const orgId = crypto.randomUUID();
    const orgSlug = company.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);

    // Step 1: Create user WITHOUT org_id first (to break circular dependency)
    const { data: createdUsers, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          name,
          company,
        }
      ])
      .select();

    if (userError) {
      logger.error('Failed to create user', userError);
      throw new Error(`User creation failed: ${userError.message}`);
    }

    if (!createdUsers || createdUsers.length === 0) {
      throw new Error('User creation returned no data');
    }

    // Step 2: Create organisation owned by this user
    const { error: orgError } = await supabase
      .from('organisations')
      .insert([
        {
          id: orgId,
          name: company,
          slug: `${orgSlug}-${Date.now()}`,
          created_by: userId,
        }
      ]);

    if (orgError) {
      logger.error('Failed to create organisation', orgError);
      throw new Error(`Organisation creation failed: ${orgError.message}`);
    }

    // Step 3: Update user to reference the organisation
    const { data: updatedUsers, error: updateError } = await supabase
      .from('users')
      .update({ org_id: orgId })
      .eq('id', userId)
      .select();

    if (updateError) {
      logger.error('Failed to update user with org_id', updateError);
      throw new Error(`User update failed: ${updateError.message}`);
    }

    return updatedUsers?.[0] || createdUsers[0];
  } catch (error) {
    logger.error('Create user failed', { email, error: error.message });
    throw error; // Propagate error instead of swallowing it
  }
}

export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  } catch (error) {
    logger.error('Get user by email failed', error);
    return null;
  }
}

export async function getUserById(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Get user by ID failed', error);
    return null;
  }
}

export async function updateUser(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    logger.error('Update user failed', error);
    return null;
  }
}

export async function deleteUser(userId) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    logger.info('User deleted', { userId });
    return true;
  } catch (error) {
    logger.error('Delete user failed', error);
    return false;
  }
}
