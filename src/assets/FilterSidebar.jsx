import React from 'react';
import Select from 'react-select';
import { Form, Button, Spinner } from 'react-bootstrap'; // InputGroup یہاں امپورٹ کریں
import { FaTimesCircle } from 'react-icons/fa'; // Make sure this is imported if used for custom filters
 // TOP OF FILE — BEFORE `function FilterSidebar(...)`
import './FilterSidebar.css';
const staticSubTypes = [
  { value: 'Billboard', label: 'Billboard' },
  { value: 'Bridge Panel', label: 'Bridge Panel' },
  { value: 'Under Passes', label: 'Under Passes' },
  { value: 'Streamers', label: 'Streamers' },
  { value: 'Mopi', label: 'Mopi' },
  { value: 'Gantry', label: 'Gantry' },
  { value: 'Bus Shelter', label: 'Bus Shelter' },
  { value: 'T Sign', label: 'T Sign' },
  { value: 'Floats', label: 'Floats' }
];
const digitalSubTypes = [
  { value: 'SMD', label: 'SMD' },
  { value: '3D SMD', label: '3D SMD' },
  { value: 'Digital Streamers', label: 'Digital Streamers' },
  { value: 'Digital Mopies', label: 'Digital Mopies' },
  { value: 'Digital Floats', label: 'Digital Floats' }
];

function FilterSidebar({
    filters,
    availableCities,
    customField,
    customValue,
    loading,
    citiesByProvince,
    environmentOptions,
    displayTypeOptions, 
    installedAtOptions,
    handleChange,
    handleFilter,
    addCustomFilter,
    removeCustomFilter,
    setCustomField,
    setCustomValue,
    handleReset,
     setFilters={setFilters},
    setCurrentPage={setCurrentPage}
}) {
     const sizeOptions = [
        { value: '60x20', label: '60x20' },
        { value: '45x15', label: '45x15' },
        { value: '20x10', label: '20x10' },
        { value: '120x30', label: '120x30' },
        { value: '169x70', label: '169x70' },
        { value: '90x30', label: '90x30' },
        { value: '40x30', label: '40x30' },
        { value: '30x40', label: '30x40' },
        { value: '20x60', label: '20x60' },
        { value: '40x20', label: '40x20' },
        { value: '20x50', label: '20x50' },
        { value: '30x15', label: '30x15' },
        { value: 'Custom', label: 'Custom' }
    ];

   // ✅ Move the function INSIDE here 👇
    const handleMultiSelect = (e) => {
        const { name, options } = e.target;
        const selectedValues = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        handleChange({
            target: {
                name,
                value: selectedValues,
            }
        });
    };
    return (
        <div style={{ width: "350px", overflowY: "auto",  padding: "1rem", flexShrink: 0 }}>
           
           <Form onSubmit={handleFilter}>
         {/* 1. Display ID */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Display ID</Form.Label>
                    <Form.Control
                        name="displayId"
                        type="text"
                        value={filters.displayId}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Display ID" // Added placeholder
                        className="custom-form-control" // Added custom class
                    />
                </Form.Group>

                {/* 2. Keyword */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Keyword</Form.Label>
                    <Form.Control
                        name="keyword"
                        type="text"
                        value={filters.keyword}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Keyword"
                        className="custom-form-control"
                    />
                </Form.Group>
{/* 3. Province (Multi-Select) */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Province</Form.Label>
                    <Select
                        isMulti
                        name="province"
                        options={Object.keys(citiesByProvince).map(prov => ({ label: prov, value: prov }))}
                        value={(filters.province || []).map(p => ({ label: p, value: p }))}
                        onChange={(selectedOptions) => {
                            setFilters(prev => ({
                                ...prev,
                                province: selectedOptions.map(opt => opt.value),
                                city: [] // Reset cities when province changes
                            }));
                            setCurrentPage(1);
                        }}
                        classNamePrefix="react-select" // Added prefix for custom styling
                        className="react-select-container" // Added container class for custom styling
                        placeholder="Select Province"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minHeight: '30px',
                                fontSize: '0.85rem'
                            }),
                            dropdownIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            clearIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            valueContainer: (provided) => ({ ...provided, padding: '0 6px' }),
                        }}
                    />
                </Form.Group>
 {/* 4. City (Multi-Select) */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">City</Form.Label>
                    <Select
                        isMulti
                        name="city"
                        isDisabled={!filters.province || filters.province.length === 0}
                        options={availableCities.map(city => ({ label: city, value: city }))}
                        value={(filters.city || []).map(c => ({ label: c, value: c }))}
                        onChange={(selectedOptions) => {
                            setFilters(prev => ({
                                ...prev,
                                city: selectedOptions.map(opt => opt.value),
                            }));
                            setCurrentPage(1);
                        }}
                        classNamePrefix="react-select" // Added prefix for custom styling
                        className="react-select-container" // Added container class for custom styling
                        placeholder="Select City"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minHeight: '30px',
                                fontSize: '0.85rem'
                            }),
                            dropdownIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            clearIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            valueContainer: (provided) => ({ ...provided, padding: '0 6px' }),
                        }}
                    />
                </Form.Group>

                {/* 5. Area */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Area</Form.Label>
                    <Form.Control
                        name="area"
                        type="text"
                        value={filters.area}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Area"
                        className="custom-form-control"
                    />
                </Form.Group>
  {/* 6. Location */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Location</Form.Label>
                    <Form.Control
                        name="location"
                        type="text"
                        value={filters.location}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Location"
                        className="custom-form-control"
                    />
                </Form.Group>
  {/* 7. Display Type */}
<Form.Group className="mb-2" key="displayType">
    <Form.Label className="filter-label small mb-0">Display Type</Form.Label>
    <div className="radio-button-group-vertical"> {/* Reusing the vertical radio button group class */}
        
        {displayTypeOptions.map(option => (
            <Form.Check
                key={`displayType-${option.toLowerCase().replace(/\s+/g, '-')}`} // Unique key for each radio button
                type="radio"
                label={option}
                name="displayType"
                value={option}
                id={`displayType-${option.toLowerCase().replace(/\s+/g, '-')}`} // Unique ID for each radio button
                checked={filters.displayType === option}
                onChange={(e) => {
                    setFilters(prev => ({
                        ...prev,
                        displayType: e.target.value,
                        displaySubType: [] // Reset displaySubType when displayType changes
                    }));
                    setCurrentPage(1);
                }}
                // size="sm" // No size prop for Form.Check in Bootstrap 5
            />
        ))}
    </div>
</Form.Group>
  {/* 8. Display Subtype (Conditional) */}
                {filters.displayType && (
                    <Form.Group className="mb-2" key="displaySubType">
                        <Form.Label className="filter-label small mb-0">
                            {filters.displayType} Subtypes
                        </Form.Label>
                        <Select
                            isMulti
                            name="displaySubType"
                            options={
                                filters.displayType === 'Static' ? staticSubTypes :
                                    filters.displayType === 'Digital' ? digitalSubTypes : []
                            }
                            value={(
                                filters.displayType === 'Static' ? staticSubTypes :
                                    filters.displayType === 'Digital' ? digitalSubTypes : []
                            ).filter(opt => filters.displaySubType?.includes(opt.value))}
                            onChange={(selectedOptions) => {
                                setFilters(prev => ({
                                    ...prev,
                                    displaySubType: selectedOptions.map(opt => opt.value)
                                }));
                                setCurrentPage(1);
                            }}
                            placeholder="Select subtypes"
                            classNamePrefix="react-select" // Added prefix for custom styling
                            className="react-select-container" // Added container class for custom styling
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    minHeight: '30px',
                                    fontSize: '0.85rem'
                                }),
                                dropdownIndicator: (provided) => ({ ...provided, padding: '2px' }),
                                clearIndicator: (provided) => ({ ...provided, padding: '2px' }),
                                valueContainer: (provided) => ({ ...provided, padding: '0 6px' }),
                            }}
                        />
                    </Form.Group>
                )}
 {/* Price Range side by side */}
                <h6 className="filter-heading mt-3 mb-1">Rate (Rs.)</h6> {/* Applied custom heading class */}
                <div className="d-flex gap-2 mb-2">
                    <Form.Control
                        name="minPrice"
                        type="number"
                        value={filters.minPrice || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="From"
                        className="custom-form-control"
                    />
                    <Form.Control
                        name="maxPrice"
                        type="number"
                        value={filters.maxPrice || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="To"
                        className="custom-form-control"
                    />
                </div>
 {/* 9. Size */}
                <Form.Group className="mb-2">
    <Form.Label className="filter-label small mb-0">Size</Form.Label>
    <Select
        isMulti
        name="size"
        options={sizeOptions}
        value={(filters.size || []).map(s => ({ label: s, value: s }))}
        onChange={(selectedOptions) => {
            setFilters(prev => ({
                ...prev,
                size: selectedOptions.map(opt => opt.value)
            }));
            setCurrentPage(1);
        }}
        classNamePrefix="react-select"
        className="react-select-container"
        placeholder="Select Size(s)"
        styles={{
            control: (provided) => ({
                ...provided,
                minHeight: '30px',
                fontSize: '0.85rem'
            }),
            dropdownIndicator: (provided) => ({ ...provided, padding: '2px' }),
            clearIndicator: (provided) => ({ ...provided, padding: '2px' }),
            valueContainer: (provided) => ({ ...provided, padding: '0 6px' }),
        }}
    />
</Form.Group>

                              {/* SQFT START HERE: SQFT Range Filter */}
                <h6 className="filter-heading mt-3 mb-1">SQFT</h6> {/* Applied custom heading class */}
                <div className="d-flex gap-2 mb-2">
                    <Form.Control
                        name="minSqft"
                        type="number"
                        value={filters.minSqft || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="From"
                        className="custom-form-control"
                    />
                    <Form.Control
                        name="maxSqft"
                        type="number"
                        value={filters.maxSqft || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="To"
                        className="custom-form-control"
                    />
                </div>

  {/* 12. Installed At (Multi-Select) */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Installed At</Form.Label>
                    <Select
                        isMulti
                        name="installedAt"
                        options={installedAtOptions.map(opt => ({ label: opt, value: opt }))}
                        value={(filters.installedAt || [])
                            .map(opt => ({ label: opt, value: opt }))}
                        onChange={(selectedOptions) => {
                            setFilters(prev => ({
                                ...prev,
                                installedAt: selectedOptions.map(opt => opt.value),
                            }));
                            setCurrentPage(1);
                        }}
                        classNamePrefix="react-select" // Added prefix for custom styling
                        className="react-select-container" // Added container class for custom styling
                        placeholder="Select Installation Type"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minHeight: '30px',
                                fontSize: '0.85rem'
                            }),
                            dropdownIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            clearIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            valueContainer: (provided) => ({ ...provided, padding: '0 6px' }),
                        }}
                    />
                </Form.Group>
               {/* 13. Lights - Radio Buttons */}
<Form.Group className="mb-2">
    <Form.Label className="filter-label small mb-1">Lights</Form.Label>
    <div className="radio-button-group-vertical"> {/* Changed from d-flex flex-col gap-1 justify-content-center to custom class */}
        <Form.Check
            type="radio"
            label="Any"
            name="lights"
            value=""
            id="lights-any"
            checked={filters.lights === ''}
            onChange={handleChange}
            // size="sm" // Bootstrap 5 no longer has a 'size' prop for Form.Check in the same way. Control with CSS.
        />
        <Form.Check
            type="radio"
            label="Yes"
            name="lights"
            value="true"
            id="lights-yes"
            checked={filters.lights === 'true'}
            onChange={handleChange}
            // size="sm"
        />
        <Form.Check
            type="radio"
            label="No"
            name="lights"
            value="false"
            id="lights-no"
            checked={filters.lights === 'false'}
            onChange={handleChange}
            // size="sm"
        />
    </div>
</Form.Group>
 {/* Impression Range - Side by side */}
                <h6 className="filter-heading mt-3 mb-1">Impressions</h6> {/* Applied custom heading class */}
                <div className="d-flex gap-2 mb-2">
                    <Form.Control
                        name="minImpression"
                        type="number"
                        value={filters.minImpression || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="From"
                        className="custom-form-control"
                    />
                    <Form.Control
                        name="maxImpression"
                        type="number"
                        value={filters.maxImpression || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="To"
                        className="custom-form-control"
                    />
                </div>
  {/* Reach Range - Side by side */}
                <h6 className="filter-heading mt-3 mb-1">Reach</h6> {/* Applied custom heading class */}
                <div className="d-flex gap-2 mb-2">
                    <Form.Control
                        name="minReach"
                        type="number"
                        value={filters.minReach || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="From"
                        className="custom-form-control"
                    />
                    <Form.Control
                        name="maxReach"
                        type="number"
                        value={filters.maxReach || ''}
                        onChange={handleChange}
                        size="sm"
                        placeholder="To"
                        className="custom-form-control"
                    />
                </div>
  {/* 16. Availability */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Availability Date</Form.Label>
                    <Form.Control
                        name="availability"
                        type="date"
                        value={filters.availability}
                        onChange={handleChange}
                        size="sm"
                        className="custom-form-control"
                    />
                </Form.Group>
  {/* 17. Traffic Coming From */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Traffic Coming From</Form.Label>
                    <Form.Control
                        name="trafficComingFrom"
                        type="text"
                        value={filters.trafficComingFrom}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Traffic From"
                        className="custom-form-control"
                    />
                </Form.Group>

                {/* 18. Traffic Going Toward */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Traffic Going Toward</Form.Label>
                    <Form.Control
                        name="trafficGoingToward"
                        type="text"
                        value={filters.trafficGoingToward}
                        onChange={handleChange}
                        size="sm"
                        placeholder="Traffic Toward"
                        className="custom-form-control"
                    />
                </Form.Group>

                {/* 19. Environment (Multi-Select) */}
                <Form.Group className="mb-2">
                    <Form.Label className="filter-label small mb-0">Environment</Form.Label>
                    <Select
                        isMulti
                        name="environment"
                        options={environmentOptions.map(opt => ({ label: opt, value: opt }))}
                        value={(filters.environment || [])
                            .map(opt => ({ label: opt, value: opt }))}
                        onChange={(selectedOptions) => {
                            setFilters(prev => ({
                                ...prev,
                                environment: selectedOptions.map(opt => opt.value),
                            }));
                            setCurrentPage(1);
                        }}
                        classNamePrefix="react-select" // Added prefix for custom styling
                        className="react-select-container" // Added container class for custom styling
                        placeholder="Select Environment"
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                minHeight: '30px',
                                fontSize: '0.85rem'
                            }),
                            dropdownIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            clearIndicator: (provided) => ({ ...provided, padding: '2px' }),
                            valueContainer: (provided) => ({ ...provided, padding: '0 6px' }),
                        }}
                    />
                </Form.Group>


                  <hr className="my-3" />
                <h6 className="filter-heading mb-2">Custom Filter</h6>
                <Form.Group className="mb-2">
                    <Form.Control
                        placeholder="Field Name (e.g., 'ownerName')"
                        value={customField}
                        onChange={e => setCustomField(e.target.value)}
                        size="sm"
                        className="custom-form-control"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        placeholder="Value"
                        value={customValue}
                        onChange={e => setCustomValue(e.target.value)}
                        size="sm"
                        className="custom-form-control"
                    />
                </Form.Group>
                <Button onClick={addCustomFilter} variant="outline-primary" className="mb-2 w-100" size="sm">Add Custom Filter</Button>

                {filters.customFilters.length > 0 && (
                    <div className="mt-2 mb-3">
                        <h6 className="filter-heading small mb-1">Added Custom Filters:</h6>
                        <ul className="list-unstyled small ps-3">
                            {filters.customFilters.map((f, idx) => (
                                <li key={idx} className="d-flex justify-content-between align-items-center mb-1">
                                    <span><strong>{f.field}:</strong> {f.value}</span>
                                    <Button variant="danger" size="sm" className="py-0 px-1" onClick={() => removeCustomFilter(idx)}><FaTimesCircle /></Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <Button type="submit" variant="primary" className="mb-2 w-100" size="sm" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Apply Filters"}
                </Button>
                <Button onClick={handleReset} variant="outline-secondary" className="w-100" size="sm" disabled={loading}>Reset</Button>
            </Form>
        </div>
    );
}

export default FilterSidebar;
