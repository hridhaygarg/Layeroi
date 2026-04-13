import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

export async function createUser(userData) {
  try {
    const { email, name, company } = userData;
    const orgId = crypto.randomUUID();

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          name,
          company,
          org_id: orgId,
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    logger.error('Create user failed', error);
    return null;
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
