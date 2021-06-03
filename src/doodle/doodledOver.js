const APPEARANCE_THRESHOLD = 0.75; // How much of a line needs to appear in that element to consider it

const IGNORE_PERCENT_THRESHOLD = 0.5; // Ignore elements that cover at least this % of the region
const SPLIT_SIZE = 10; // Split into 2 sub regions (vertically, horizontal shouldn't be common) when one contains this many elements

/**
 * Gets the area of the element
 * @param {Element} elem
 * @returns {number}
 */
function getArea(elem) {
  return (
    elem.getBoundingClientRect().width * elem.getBoundingClientRect().height
  );
}

/**
 * Gets the top of the element, in pixels relative to the page.
 * @param {Element} elem
 * @returns {number}
 */
function elemTop(elem) {
  return elem.getBoundingClientRect().top + document.documentElement.scrollTop;
}

/**
 * Calculates how much a given element overlaps the height band given
 * @param {number} top
 * @param {number} height
 * @param {Element} elem
 * @returns {number}
 */
function calculateOverlap(top, height, elem) {
  // Calculates vertical overlap of a height band + element
  // Start by finding elem top/bottom, removing any overflow of the band
  const eTop = Math.max(top, elemTop(elem));
  const eBottom = Math.min(
    top + height,
    elem.getBoundingClientRect().bottom + document.documentElement.scrollTop
  );

  // Return ratios of heights
  return (eBottom - eTop) / height;
}

class PointResolver {
  /**
   *
   * @param {Element[]} elements
   * @param {number} top
   * @param {number} bottom
   */
  constructor(elements, top, bottom) {
    this.top = top;
    this.bottom = bottom;
    /** @type {PointResolver[]} */
    this.subResolvers = [];
    /** @type {Element[]} */
    this.elements = elements.filter(
      elem =>
        calculateOverlap(top, bottom - top, elem) >= IGNORE_PERCENT_THRESHOLD
    );

    const minorElems = elements.filter(
      elem =>
        calculateOverlap(top, bottom - top, elem) < IGNORE_PERCENT_THRESHOLD
    );
    if (minorElems.length < SPLIT_SIZE) {
      this.elements = this.elements.concat(minorElems);
    } else {
      // Need to go to sub resolvers for minor elements.
      const midpoint = (top + bottom) / 2;
      const firstHalf = elements.filter(e => elemTop(e) < midpoint);
      const secondHalf = elements.filter(
        e =>
          e.getBoundingClientRect().bottom +
            document.documentElement.scrollTop >=
          midpoint
      );

      this.subResolvers = [
        new PointResolver(firstHalf, top, midpoint),
        new PointResolver(secondHalf, midpoint + 1, bottom),
      ];
    }
  }
  /**
   * Returns all elements that the point lies inside of
   * @param {number} x x-coord of the point
   * @param {number} y y-coord of the point
   * @returns {Element[]}
   */
  resolvePoint(x, y) {
    // If out of our range, then just return nothing.
    if (Math.ceil(y) < this.top || Math.floor(y) > this.bottom) {
      return [];
    }
    // Any sub-band should also be allowed to resolve
    /** @type {Element[]} */
    const subResolved = this.subResolvers.reduce(
      // @ts-ignore For some reason, it's trying to give arr the type never[]
      (arr, resolver) => arr.concat(resolver.resolvePoint(x, y)),
      []
    );
    const containingElems = this.elements.filter(elem => {
      return (
        y > elemTop(elem) && // point lies below the top of elem
        y <
          elem.getBoundingClientRect().bottom +
            document.documentElement.scrollTop && // and above bottom
        x >
          elem.getBoundingClientRect().left +
            document.documentElement.scrollLeft && // to the right of left side
        x <
          elem.getBoundingClientRect().right +
            document.documentElement.scrollLeft
      ); // to the left of right side
    });
    return subResolved.concat(containingElems);
  }
}

// Hmm, not really a great class name, sadly.
export class DoodleElementFinder {
  /**
   * @param {HTMLElement | null} root - Element containing the doodle. Defaults to the <body> element of the page.
   */
  constructor(root) {
    if (root === null) {
      root = document.querySelector('body');
    }
    if (root === null) {
      throw Error("Couldn't find body element");
    }
    const allElements = root.querySelectorAll('*');
    this.resolver = new PointResolver(
      Array.from(allElements).filter(
        elem =>
          elem.getBoundingClientRect().width > 0 &&
          elem.getBoundingClientRect().height > 0
      ),
      root.getBoundingClientRect().top + document.documentElement.scrollTop,
      root.getBoundingClientRect().bottom + document.documentElement.scrollTop
    );
  }

  /**
   * Returns all Elements that the given point overlaps
   * @param {number} x
   * @param {number} y
   * @returns {Element[]}
   */
  resolvePoint(x, y) {
    return this.resolver.resolvePoint(x, y);
  }

  /**
   * Returns all Elements that the line overlaps
   * @param {import("../types/api").DoodleLine} line
   * @returns {Element}
   */
  resolveLine(line) {
    // Map from element to count of times that element has been doodled over
    /** @type {Map<Element, number>}  */
    let elems = new Map();
    line.points.forEach(point => {
      this.resolvePoint(point[0], point[1]).forEach(elem => {
        if (!elems.has(elem)) {
          elems.set(elem, 0);
        }
        // @ts-ignore .get() can't be undefined, as we just set it.
        elems.set(elem, elems.get(elem) + 1);
      });
    });
    // Sort elements by appearance count, largest to smallest
    const sortedElems = Array.from(elems.entries()).sort((a, b) => b[1] - a[1]);
    // Get ones that appear enough times, and map back down to only element, removing count
    const overAppearanceThreshold = sortedElems
      .filter(entry => entry[1] >= APPEARANCE_THRESHOLD * line.points.length)
      .map(elem => elem[0]);
    if (overAppearanceThreshold.length === 0) {
      return sortedElems[0][0];
    }

    return overAppearanceThreshold.reduce((prev, curr) => {
      return getArea(prev) <= getArea(curr) ? prev : curr;
    }, overAppearanceThreshold[0]);
  }
}
