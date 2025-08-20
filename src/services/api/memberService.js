import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const memberService = {
  async getCurrentMember() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "emergency_contact_c" } },
          { field: { Name: "membership_type_c" } },
          { field: { Name: "membership_plan_c" } },
          { field: { Name: "join_date_c" } },
          { field: { Name: "expiry_date_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "qr_code_c" } },
          { field: { Name: "goal_weight_c" } },
          { field: { Name: "current_weight_c" } },
          { field: { Name: "height_c" } },
          { field: { Name: "fitness_goal_c" } },
          { field: { Name: "preferred_workout_time_c" } },
          { field: { Name: "streak_c" } },
          { field: { Name: "total_workouts_c" } },
          { field: { Name: "monthly_visits_c" } },
          { field: { Name: "favorite_classes_c" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords("member_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const member = response.data[0];
      return {
        Id: member.Id,
        name: member.Name,
        email: member.email_c,
        phone: member.phone_c,
        emergencyContact: member.emergency_contact_c,
        membershipType: member.membership_type_c,
        membershipPlan: member.membership_plan_c,
        joinDate: member.join_date_c,
        expiryDate: member.expiry_date_c,
        status: member.status_c,
        qrCode: member.qr_code_c,
        goalWeight: member.goal_weight_c,
        currentWeight: member.current_weight_c,
        height: member.height_c,
        fitnessGoal: member.fitness_goal_c,
        preferredWorkoutTime: member.preferred_workout_time_c,
        streak: member.streak_c,
        totalWorkouts: member.total_workouts_c,
        monthlyVisits: member.monthly_visits_c,
        favoriteClasses: member.favorite_classes_c ? member.favorite_classes_c.split(',') : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current member:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  },

  async updateMember(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names
      const updateData = {
        Id: parseInt(id)
      };

      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.email !== undefined) updateData.email_c = updates.email;
      if (updates.phone !== undefined) updateData.phone_c = updates.phone;
      if (updates.emergencyContact !== undefined) updateData.emergency_contact_c = updates.emergencyContact;
      if (updates.currentWeight !== undefined) updateData.current_weight_c = updates.currentWeight;
      if (updates.goalWeight !== undefined) updateData.goal_weight_c = updates.goalWeight;
      if (updates.height !== undefined) updateData.height_c = updates.height;
      if (updates.membershipType !== undefined) updateData.membership_type_c = updates.membershipType;
      if (updates.fitnessGoal !== undefined) updateData.fitness_goal_c = updates.fitnessGoal;
      if (updates.preferredWorkoutTime !== undefined) updateData.preferred_workout_time_c = updates.preferredWorkoutTime;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("member_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Member not found");
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update member ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update member");
        }
      }

      // Return updated member
      return await this.getCurrentMember();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating member:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getMemberStats(id) {
    try {
      const member = await this.getCurrentMember();
      if (!member) throw new Error("Member not found");
      
      return {
        streak: member.streak || 0,
        totalWorkouts: member.totalWorkouts || 0,
        monthlyVisits: member.monthlyVisits || 0,
        weightProgress: {
          current: member.currentWeight || 0,
          goal: member.goalWeight || 0,
          change: member.currentWeight && member.goalWeight ? 
            member.currentWeight - (member.goalWeight + 10) : 0
        },
        weeklyProgress: [
          { day: "Mon", workouts: 1, calories: 350 },
          { day: "Tue", workouts: 0, calories: 0 },
          { day: "Wed", workouts: 1, calories: 420 },
          { day: "Thu", workouts: 0, calories: 0 },
          { day: "Fri", workouts: 1, calories: 380 },
          { day: "Sat", workouts: 1, calories: 450 },
          { day: "Sun", workouts: 0, calories: 0 }
        ]
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching member stats:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Body Metrics Operations
  getBodyMetrics: async (memberId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date_c" } },
          { field: { Name: "weight_c" } },
          { field: { Name: "body_fat_percentage_c" } },
          { field: { Name: "muscle_mass_c" } },
          { field: { Name: "visceral_fat_c" } },
          { field: { Name: "water_percentage_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "member_c",
            Operator: "EqualTo",
            Values: [parseInt(memberId)]
          }
        ],
        orderBy: [
          { fieldName: "date_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("body_metric_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(metric => ({
        Id: metric.Id,
        date: metric.date_c,
        weight: metric.weight_c,
        bodyFatPercentage: metric.body_fat_percentage_c,
        muscleMass: metric.muscle_mass_c,
        visceralFat: metric.visceral_fat_c,
        waterPercentage: metric.water_percentage_c,
        createdAt: metric.created_at_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching body metrics:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  addBodyMetric: async (memberId, metricData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Name: `Body Metric - ${metricData.date}`,
            date_c: metricData.date,
            weight_c: metricData.weight,
            body_fat_percentage_c: metricData.bodyFatPercentage,
            muscle_mass_c: metricData.muscleMass,
            visceral_fat_c: metricData.visceralFat,
            water_percentage_c: metricData.waterPercentage,
            created_at_c: new Date().toISOString(),
            member_c: parseInt(memberId)
          }
        ]
      };

      const response = await apperClient.createRecord("body_metric_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to add body metric");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create body metrics ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to add body metric");
        }
        
        if (successfulRecords.length > 0) {
          const newMetric = successfulRecords[0].data;
          return {
            Id: newMetric.Id,
            date: newMetric.date_c,
            weight: newMetric.weight_c,
            bodyFatPercentage: newMetric.body_fat_percentage_c,
            muscleMass: newMetric.muscle_mass_c,
            visceralFat: newMetric.visceral_fat_c,
            waterPercentage: newMetric.water_percentage_c,
            createdAt: newMetric.created_at_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding body metric:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  updateBodyMetric: async (memberId, metricId, metricData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(metricId),
        date_c: metricData.date,
        weight_c: metricData.weight,
        body_fat_percentage_c: metricData.bodyFatPercentage,
        muscle_mass_c: metricData.muscleMass,
        visceral_fat_c: metricData.visceralFat,
        water_percentage_c: metricData.waterPercentage
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("body_metric_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update body metric");
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update body metrics ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update body metric");
        }
      }

      return {
        Id: parseInt(metricId),
        date: metricData.date,
        weight: metricData.weight,
        bodyFatPercentage: metricData.bodyFatPercentage,
        muscleMass: metricData.muscleMass,
        visceralFat: metricData.visceralFat,
        waterPercentage: metricData.waterPercentage
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating body metric:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  deleteBodyMetric: async (memberId, metricId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(metricId)]
      };

      const response = await apperClient.deleteRecord("body_metric_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to delete body metric");
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete body metrics ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return { success: false };
        }
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting body metric:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  // Medical History Operations
  getMedicalHistory: async (memberId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "medication_c" } },
          { field: { Name: "allergies_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "date_added_c" } },
          { field: { Name: "last_updated_c" } }
        ],
        where: [
          {
            FieldName: "member_c",
            Operator: "EqualTo",
            Values: [parseInt(memberId)]
          }
        ],
        orderBy: [
          { fieldName: "date_added_c", sorttype: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords("medical_history_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(history => ({
        Id: history.Id,
        condition: history.condition_c,
        medication: history.medication_c,
        allergies: history.allergies_c,
        notes: history.notes_c,
        dateAdded: history.date_added_c,
        lastUpdated: history.last_updated_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching medical history:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  addMedicalHistory: async (memberId, medicalData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        records: [
          {
            Name: medicalData.condition,
            condition_c: medicalData.condition,
            medication_c: medicalData.medication || '',
            allergies_c: medicalData.allergies || '',
            notes_c: medicalData.notes || '',
            date_added_c: today,
            last_updated_c: today,
            member_c: parseInt(memberId)
          }
        ]
      };

      const response = await apperClient.createRecord("medical_history_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to add medical history");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create medical history ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to add medical history");
        }
        
        if (successfulRecords.length > 0) {
          const newEntry = successfulRecords[0].data;
          return {
            Id: newEntry.Id,
            condition: newEntry.condition_c,
            medication: newEntry.medication_c,
            allergies: newEntry.allergies_c,
            notes: newEntry.notes_c,
            dateAdded: newEntry.date_added_c,
            lastUpdated: newEntry.last_updated_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding medical history:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  updateMedicalHistory: async (memberId, entryId, medicalData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date().toISOString().split('T')[0];
      
      const updateData = {
        Id: parseInt(entryId),
        Name: medicalData.condition,
        condition_c: medicalData.condition,
        medication_c: medicalData.medication || '',
        allergies_c: medicalData.allergies || '',
        notes_c: medicalData.notes || '',
        last_updated_c: today
      };

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord("medical_history_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update medical history");
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to update medical history ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update medical history");
        }
      }

      return {
        Id: parseInt(entryId),
        condition: medicalData.condition,
        medication: medicalData.medication || '',
        allergies: medicalData.allergies || '',
        notes: medicalData.notes || '',
        dateAdded: medicalData.dateAdded,
        lastUpdated: today
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating medical history:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  deleteMedicalHistory: async (memberId, entryId) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(entryId)]
      };

      const response = await apperClient.deleteRecord("medical_history_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete medical history ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting medical history:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
};

export default memberService;