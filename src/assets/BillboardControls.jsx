import React from 'react';
import { Button, Nav, Pagination } from 'react-bootstrap';
import { FaThLarge, FaList } from 'react-icons/fa';

function BillboardControls({
    loading,
    totalItems,
    currentPage,
    totalPages,
    setCurrentPage,
    sortOption,
    handleSortSelect,
    handleDownloadExcel,
    handleDownloadPPT,
    viewMode,
    setViewMode
}) {
    const showPagination = totalPages > 1;
    const isDownloadDisabled = loading || totalItems === 0;

    const sortOptionsMapping = [
        { key: 'recentlyAdded', label: 'Newest' },
        { key: 'mostPopular', label: 'Popular' },
        { key: 'maxToMin', label: 'Price (High to Low)' },
        { key: 'minToMax', label: 'Price (Low to High)' },
    ];

    return (
        <>
            {/* SORTING + VIEW TOGGLE */}
            <div className="d-flex justify-content-between align-items-center mb-3 px-3 py-2" style={{ backgroundColor: '#f0f0f0' }}>
                {/* Sort Bar */}
                <div className="d-flex align-items-center flex-wrap gap-2">
                    <span className="me-3 fw-bold">Sort by:</span>
                    <Nav variant="pills" activeKey={sortOption} onSelect={handleSortSelect}>
                        {sortOptionsMapping.map(option => (
                            <Nav.Item key={option.key}>
                                <Nav.Link
                                    eventKey={option.key}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        color: sortOption === option.key ? '#ffc107' : 'black',
                                        padding: '0.25rem 0.5rem',
                                        marginRight: '15px',
                                        cursor: 'pointer',
                                        fontWeight: sortOption === option.key ? 'bold' : 'normal',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {option.label.toUpperCase()}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>

                {/* Grid / List Toggle */}
                <div className="d-flex align-items-center gap-3">
                    <FaThLarge
                        onClick={() => setViewMode("grid")}
                        title="Grid View"
                        style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: viewMode === "grid" ? "#ffc107" : "#6c757d",
                            transition: "color 0.3s"
                        }}
                    />
                    <FaList
                        onClick={() => setViewMode("list")}
                        title="List View"
                        style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: viewMode === "list" ? "#ffc107" : "#6c757d",
                            transition: "color 0.3s"
                        }}
                    />
                </div>
            </div>

            {/* FOUND + DOWNLOAD + PAGINATION */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 px-3">
                {/* Total Found */}
                <span className="fw-bold fs-5">
                    {totalItems} FOUND
                </span>

                {/* Download Buttons */}
                <div className="d-flex gap-2">
                    <Button
                        variant="success"
                        onClick={handleDownloadExcel}
                        disabled={isDownloadDisabled}
                    >
                        Download Excel
                    </Button>
                    <Button
                        variant="info"
                        onClick={handleDownloadPPT}
                        disabled={isDownloadDisabled}
                    >
                        Download PPT
                    </Button>
                </div>
            </div>

            {/* PAGINATION */}
            {showPagination && (
                <Pagination className="justify-content-center">
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || loading} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1 || loading} />
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2))
                        .map(page => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                                disabled={loading}
                            >
                                {page}
                            </Pagination.Item>
                        ))}
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || loading} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || loading} />
                </Pagination>
            )}
        </>
    );
}

export default BillboardControls;
