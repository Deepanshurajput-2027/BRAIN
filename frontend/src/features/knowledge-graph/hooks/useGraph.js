import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

export const useGraph = (nodes, links, onNodeClick) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

  const updateGraph = useCallback(() => {
    const svg = d3.select(svgRef.current);
    const parent = svgRef.current?.parentElement;
    if (!parent || !nodes.length) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;
    
    if (width === 0 || height === 0) return;

    svg.attr('viewBox', [0, 0, width, height]);

    // Clone nodes and links to prevent 'object is not extensible' error from Redux
    const nodesCopy = nodes.map(d => ({ ...d }));
    const linksCopy = links.map(d => ({ ...d }));

    // Cleanup previous simulation
    if (simulationRef.current) simulationRef.current.stop();

    const simulation = d3.forceSimulation(nodesCopy)
      .force('link', d3.forceLink(linksCopy).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));


    simulationRef.current = simulation;

    const g = svg.select('g.main-container');
    if (g.empty()) {
      svg.append('g').attr('class', 'main-container');
    }

    const container = svg.select('g.main-container');

    // Link rendering
    let link = container.selectAll('.link')
      .data(linksCopy, d => `${d.source.id || d.source}-${d.target.id || d.target}`);

    link.exit().remove();

    const linkEnter = link.enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'rgba(255, 255, 255, 0.08)')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.value || 1) * 2);

    link = linkEnter.merge(link);

    // Node rendering
    let node = container.selectAll('.node')
      .data(nodesCopy, d => d.id);

    node.exit().remove();

    const nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
      .call(drag(simulation))
      .on('click', (event, d) => onNodeClick(d.id))
      .on('mouseover', (event, d) => {
        const neighbors = new Set();
        neighbors.add(d.id);
        linksCopy.forEach(l => {
          if (l.source.id === d.id) neighbors.add(l.target.id);
          if (l.target.id === d.id) neighbors.add(l.source.id);
        });

        container.selectAll('.node circle')
          .transition().duration(200)
          .attr('opacity', n => neighbors.has(n.id) ? 1 : 0.2);
        
        container.selectAll('.node text')
          .transition().duration(200)
          .attr('opacity', n => neighbors.has(n.id) ? 1 : 0.1);

        container.selectAll('.link')
          .transition().duration(200)
          .attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 1 : 0.05)
          .attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? '#6366f1' : 'rgba(255, 255, 255, 0.08)');
      })
      .on('mouseout', () => {
        container.selectAll('.node circle, .node text')
          .transition().duration(200)
          .attr('opacity', 1);

        container.selectAll('.link')
          .transition().duration(200)
          .attr('stroke-opacity', 0.6)
          .attr('stroke', 'rgba(255, 255, 255, 0.08)');
      });

    nodeEnter.append('circle')
      .attr('r', 8)
      .attr('fill', d => {
        switch (d.type) {
          case 'video': return '#f97316'; // Orange
          case 'tweet': return '#0ea5e9'; // Blue
          case 'article': return '#4f46e5'; // Indigo
          case 'image': return '#10b981'; // Green
          case 'pdf':
          case 'document': return '#ef4444'; // Red
          default: return '#64748b'; // Slate
        }
      })
      .attr('stroke', '#030014')
      .attr('stroke-width', 2);

    nodeEnter.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.title.length > 20 ? d.title.substring(0, 17) + '...' : d.title)
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('fill', '#94A3B8');

    node = nodeEnter.merge(node);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Zoom functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    svgRef.current.recenter = () => {
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
      );
    };

    svgRef.current.zoomIn = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    };

    svgRef.current.zoomOut = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    };

    return () => simulation.stop();
  }, [nodes, links, onNodeClick]);

  useEffect(() => {
    if (!svgRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      updateGraph();
    });
    
    const parent = svgRef.current.parentElement;
    if (parent) resizeObserver.observe(parent);
    
    return () => {
      resizeObserver.disconnect();
      if (simulationRef.current) simulationRef.current.stop();
    };
  }, [updateGraph]);

  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return { svgRef };
};
