// components/BeautifulForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
  CakeIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  CameraIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";

const Form = ({
  isOpen,
  formData,
  setFormData,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  fields,
  title
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [imagePreview, setImagePreview] = useState(null);

  /* ===============================
     DEFAULT FIELD CONFIG
  =============================== */

  const defaultFieldConfig = {
    firstName: { icon: UserIcon, type: "text", label: "First Name", tab: "basic" },
    lastName: { icon: UserIcon, type: "text", label: "Last Name", tab: "basic" },
    email: { icon: EnvelopeIcon, type: "email", label: "Email", tab: "contact" },
    phone: { icon: PhoneIcon, type: "tel", label: "Phone", tab: "contact" },
    dateOfBirth: { icon: CakeIcon, type: "date", label: "Date of Birth", tab: "personal" },
    gender: {
      icon: IdentificationIcon,
      type: "select",
      label: "Gender",
      tab: "personal",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" }
      ]
    },
    address: { icon: MapPinIcon, type: "textarea", label: "Address", tab: "location" },
    city: { icon: MapPinIcon, type: "text", label: "City", tab: "location" },
    country: { icon: GlobeAltIcon, type: "text", label: "Country", tab: "location" },
    occupation: { icon: BriefcaseIcon, type: "text", label: "Occupation", tab: "professional" }
  };

  const fieldConfig = fields || defaultFieldConfig;

  /* ===============================
     INITIAL DATA
  =============================== */

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dateOfBirth: initialData.dateOfBirth
          ? initialData.dateOfBirth.split("T")[0]
          : ""
      });
    }
  }, [initialData]);

  /* ===============================
     TABS
  =============================== */

  const tabs = useMemo(() => {
    const uniqueTabs = new Set();
    Object.values(fieldConfig).forEach((f) => {
      if (f.tab) uniqueTabs.add(f.tab);
    });

    const iconMap = {
      basic: UserIcon,
      personal: IdentificationIcon,
      contact: EnvelopeIcon,
      location: MapPinIcon,
      professional: BriefcaseIcon,
      academic: AcademicCapIcon
    };

    return Array.from(uniqueTabs).map((tab) => ({
      id: tab,
      name: tab.charAt(0).toUpperCase() + tab.slice(1),
      icon: iconMap[tab] || UserIcon
    }));
  }, [fieldConfig]);

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs]);

  /* ===============================
     HANDLERS
  =============================== */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  /* ===============================
     FIELD RENDER
  =============================== */

  const inputClass = `
    w-full p-3 rounded-xl
    bg-white dark:bg-slate-800
    border border-slate-300 dark:border-slate-600
    text-slate-900 dark:text-white
    focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500
    transition-all duration-200
  `;

  const renderField = (key) => {
    const config = fieldConfig[key];
    if (!config) return null;

    if (config.type === "textarea") {
      return (
        <textarea
          name={key}
          value={formData[key] || ""}
          onChange={handleChange}
          className={inputClass}
        />
      );
    }

    if (config.type === "select") {
      return (
        <select
          name={key}
          value={formData[key] || ""}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Select</option>
          {config.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={config.type || "text"}
        name={key}
        value={formData[key] || ""}
        onChange={handleChange}
        className={inputClass}
      />
    );
  };

  /* ===============================
     RETURN
  =============================== */

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black/50 backdrop-blur-sm
        transition-all duration-300
        ${isOpen
          ? "opacity-100 visible pointer-events-auto"
          : "opacity-0 invisible pointer-events-none"}
      `}
    >
      <div className="w-full max-w-3xl 
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
        rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">

        {/* HEADER */}
        <div className="flex justify-between items-center p-5 
          bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit" : "Create"} {title}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 px-6 
          border-b border-slate-200 dark:border-slate-700
          bg-slate-50 dark:bg-slate-800/50 transition-colors duration-300">

          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 text-sm flex items-center gap-2 border-b-2 transition-all duration-200
                  ${activeTab === tab.id
                    ? "border-cyan-600 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 max-h-[60vh] overflow-y-auto"
        >
          {Object.keys(formData)
            .filter((key) => fieldConfig[key]?.tab === activeTab)
            .map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  {fieldConfig[key]?.label}
                </label>
                {renderField(key)}
              </div>
            ))}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl
                border border-slate-300 dark:border-slate-600
                text-slate-700 dark:text-slate-300
                hover:bg-slate-100 dark:hover:bg-slate-800
                transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl
                bg-gradient-to-r from-cyan-600 to-blue-600
                hover:from-cyan-700 hover:to-blue-700
                text-white shadow-lg
                transition-all duration-200"
            >
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
