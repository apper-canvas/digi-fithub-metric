import { toast } from "react-toastify";

const classService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "datetime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "booked_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "calories_c" } }
        ],
        orderBy: [
          { fieldName: "datetime_c", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(cls => ({
        Id: cls.Id,
        name: cls.Name,
        instructor: cls.instructor_c,
        datetime: new Date(cls.datetime_c),
        duration: cls.duration_c,
        capacity: cls.capacity_c,
        booked: cls.booked_c,
        type: cls.type_c,
        difficulty: cls.difficulty_c,
        description: cls.description_c,
        calories: cls.calories_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching classes:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "datetime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "booked_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "calories_c" } }
        ]
      };

      const response = await apperClient.getRecordById("class_c", parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Class not found");
      }

      const cls = response.data;
      return {
        Id: cls.Id,
        name: cls.Name,
        instructor: cls.instructor_c,
        datetime: new Date(cls.datetime_c),
        duration: cls.duration_c,
        capacity: cls.capacity_c,
        booked: cls.booked_c,
        type: cls.type_c,
        difficulty: cls.difficulty_c,
        description: cls.description_c,
        calories: cls.calories_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching class:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async getTodaysClasses() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "datetime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "booked_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "calories_c" } }
        ],
        where: [
          {
            FieldName: "datetime_c",
            Operator: "GreaterThanOrEqualTo",
            Values: [today.toISOString().split('T')[0]]
          },
          {
            FieldName: "datetime_c", 
            Operator: "LessThan",
            Values: [tomorrow.toISOString().split('T')[0]]
          }
        ],
        orderBy: [
          { fieldName: "datetime_c", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(cls => ({
        Id: cls.Id,
        name: cls.Name,
        instructor: cls.instructor_c,
        datetime: new Date(cls.datetime_c),
        duration: cls.duration_c,
        capacity: cls.capacity_c,
        booked: cls.booked_c,
        type: cls.type_c,
        difficulty: cls.difficulty_c,
        description: cls.description_c,
        calories: cls.calories_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's classes:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async getUpcomingClasses() {
    try {
      const now = new Date();

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "datetime_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "booked_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "difficulty_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "calories_c" } }
        ],
        where: [
          {
            FieldName: "datetime_c",
            Operator: "GreaterThan",
            Values: [now.toISOString()]
          }
        ],
        orderBy: [
          { fieldName: "datetime_c", sorttype: "ASC" }
        ],
        pagingInfo: { limit: 5, offset: 0 }
      };

      const response = await apperClient.fetchRecords("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(cls => ({
        Id: cls.Id,
        name: cls.Name,
        instructor: cls.instructor_c,
        datetime: new Date(cls.datetime_c),
        duration: cls.duration_c,
        capacity: cls.capacity_c,
        booked: cls.booked_c,
        type: cls.type_c,
        difficulty: cls.difficulty_c,
        description: cls.description_c,
        calories: cls.calories_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching upcoming classes:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  },

  async bookClass(classId, memberId) {
    try {
      // First get the current class data
      const classData = await this.getById(classId);
      
      if (classData.booked >= classData.capacity) {
        throw new Error("Class is fully booked");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Update the booked count
      const params = {
        records: [
          {
            Id: parseInt(classId),
            booked_c: classData.booked + 1
          }
        ]
      };

      const response = await apperClient.updateRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to book class");
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to book class ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to book class");
        }
      }

      return { success: true, message: "Class booked successfully" };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error booking class:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  },

  async cancelBooking(classId, memberId) {
    try {
      // First get the current class data
      const classData = await this.getById(classId);
      
      if (classData.booked <= 0) {
        throw new Error("No bookings to cancel");
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Update the booked count
      const params = {
        records: [
          {
            Id: parseInt(classId),
            booked_c: Math.max(0, classData.booked - 1)
          }
        ]
      };

      const response = await apperClient.updateRecord("class_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to cancel booking");
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        if (failedUpdates.length > 0) {
          console.error(`Failed to cancel booking ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to cancel booking");
        }
      }

      return { success: true, message: "Booking cancelled successfully" };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error cancelling booking:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }
};

export default classService;