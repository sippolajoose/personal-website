<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { NButton } from 'naive-ui';
import { useI18n } from 'vue-i18n';

type ObstacleShape = 'bar' | 'circle' | 'triangle';
type FeatureType = 'booster' | 'ramp';
type FeatureShape = 'triangle' | 'square' | 'circle';

interface RectangleLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Obstacle extends RectangleLike {
  type: ObstacleShape;
}

interface CourseFeature extends RectangleLike {
  type: FeatureType;
  shape: FeatureShape;
  direction?: 1 | -1;
}

interface CourseSettings {
  obstacleCount: number;
  bonusCount: number;
}

interface Hole {
  start: { x: number; y: number };
  target: { x: number; y: number };
  obstacles: Obstacle[];
  features: CourseFeature[];
}

const courseWidth = 800;
const courseHeight = 500;
const ballRadius = 10;
const playBounds = { minX: 44, maxX: 756, minY: 44, maxY: 456 };
const navigationGrid = { columns: 36, rows: 21, cellSize: 20 };
const featureShapes: FeatureShape[] = ['triangle', 'square', 'circle'];

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pointToGrid(point: { x: number; y: number }) {
  return {
    column: Math.max(0, Math.min(navigationGrid.columns - 1, Math.round((point.x - playBounds.minX) / navigationGrid.cellSize))),
    row: Math.max(0, Math.min(navigationGrid.rows - 1, Math.round((point.y - playBounds.minY) / navigationGrid.cellSize)))
  };
}

function gridToPoint(column: number, row: number) {
  return {
    x: playBounds.minX + column * navigationGrid.cellSize,
    y: playBounds.minY + row * navigationGrid.cellSize
  };
}

function isPointBlocked(point: { x: number; y: number }, obstacles: Obstacle[]) {
  const clearance = ballRadius + 6;

  return obstacles.some(
    (obstacle) =>
      point.x >= obstacle.x - clearance &&
      point.x <= obstacle.x + obstacle.width + clearance &&
      point.y >= obstacle.y - clearance &&
      point.y <= obstacle.y + obstacle.height + clearance
  );
}

function isCourseSolvable(start: { x: number; y: number }, target: { x: number; y: number }, obstacles: Obstacle[]) {
  const startCell = pointToGrid(start);
  const targetCell = pointToGrid(target);
  const queue = [startCell];
  const visited = new Set([`${startCell.column},${startCell.row}`]);

  if (isPointBlocked(gridToPoint(startCell.column, startCell.row), obstacles) || isPointBlocked(gridToPoint(targetCell.column, targetCell.row), obstacles)) {
    return false;
  }

  while (queue.length > 0) {
    const cell = queue.shift();

    if (!cell) {
      break;
    }

    if (cell.column === targetCell.column && cell.row === targetCell.row) {
      return true;
    }

    const neighbors = [
      { column: cell.column - 1, row: cell.row },
      { column: cell.column + 1, row: cell.row },
      { column: cell.column, row: cell.row - 1 },
      { column: cell.column, row: cell.row + 1 }
    ];

    neighbors.forEach((neighbor) => {
      const key = `${neighbor.column},${neighbor.row}`;
      const isInsideGrid = neighbor.column >= 0 && neighbor.column < navigationGrid.columns && neighbor.row >= 0 && neighbor.row < navigationGrid.rows;

      if (!isInsideGrid || visited.has(key) || isPointBlocked(gridToPoint(neighbor.column, neighbor.row), obstacles)) {
        return;
      }

      visited.add(key);
      queue.push(neighbor);
    });
  }

  return false;
}

function overlaps(first: RectangleLike, second: RectangleLike, padding: number) {
  return (
    first.x < second.x + second.width + padding &&
    first.x + first.width + padding > second.x &&
    first.y < second.y + second.height + padding &&
    first.y + first.height + padding > second.y
  );
}

function createRandomObstacle(obstacleCount = 3) {
  const shapeRoll = Math.random();
  const crowdedCourse = obstacleCount > 10;

  if (shapeRoll < 0.3) {
    const size = crowdedCourse ? randomInteger(34, 68) : randomInteger(48, 96);

    return {
      type: 'circle' as const,
      x: randomInteger(160, playBounds.maxX - size - 120),
      y: randomInteger(playBounds.minY + 10, playBounds.maxY - size - 10),
      width: size,
      height: size
    };
  }

  if (shapeRoll < 0.55) {
    const width = crowdedCourse ? randomInteger(48, 100) : randomInteger(70, 150);
    const height = crowdedCourse ? randomInteger(48, 100) : randomInteger(70, 150);

    return {
      type: 'triangle' as const,
      x: randomInteger(160, playBounds.maxX - width - 120),
      y: randomInteger(playBounds.minY + 10, playBounds.maxY - height - 10),
      width,
      height
    };
  }

  const vertical = Math.random() > 0.3;
  const width = vertical ? randomInteger(18, 32) : crowdedCourse ? randomInteger(80, 160) : randomInteger(120, 220);
  const height = vertical ? crowdedCourse ? randomInteger(70, 160) : randomInteger(100, 220) : randomInteger(18, 32);

  return {
    type: 'bar' as const,
    x: randomInteger(160, playBounds.maxX - width - 120),
    y: randomInteger(playBounds.minY + 10, playBounds.maxY - height - 10),
    width,
    height
  };
}

function createRandomFeature(type: FeatureType): CourseFeature {
  const shape = featureShapes[randomInteger(0, featureShapes.length - 1)];
  const size = type === 'booster' ? randomInteger(68, 132) : randomInteger(72, 104);
  const width = shape === 'circle' || shape === 'square' ? size : type === 'booster' ? randomInteger(82, 156) : 96;
  const height = shape === 'circle' || shape === 'square' ? size : type === 'booster' ? randomInteger(40, 72) : 68;

  return {
    type,
    shape,
    ...(type === 'booster' ? { direction: Math.random() > 0.5 ? 1 : -1 } : {}),
    x: randomInteger(180, playBounds.maxX - width - 100),
    y: randomInteger(playBounds.minY + 20, playBounds.maxY - height - 20),
    width,
    height
  };
}

function createCourseFeatures(start: { x: number; y: number }, target: { x: number; y: number }, obstacles: Obstacle[], bonusCount: number) {
  const features: CourseFeature[] = [];
  const startBuffer = { x: start.x - 55, y: start.y - 55, width: 110, height: 110 };
  const targetBuffer = { x: target.x - 55, y: target.y - 55, width: 110, height: 110 };
  const bonusTypes: FeatureType[] = Array.from(
    { length: bonusCount },
    () => (Math.random() > 0.5 ? 'booster' : 'ramp')
  );

  bonusTypes.forEach((type) => {
    for (let attempt = 0; attempt < 240; attempt += 1) {
      const feature = createRandomFeature(type);
      const isNearStart = overlaps(feature, startBuffer, 0);
      const isNearTarget = overlaps(feature, targetBuffer, 0);
      const overlapsObstacle = obstacles.some((obstacle) => overlaps(feature, obstacle, 10));
      const overlapsFeature = features.some((existing) => overlaps(feature, existing, 20));
      const isReachable =
        type !== 'ramp' ||
        isCourseSolvable(start, { x: feature.x + feature.width / 2, y: feature.y + feature.height / 2 }, obstacles);

      if (!isNearStart && !isNearTarget && !overlapsObstacle && !overlapsFeature && isReachable) {
        features.push(feature);
        break;
      }
    }
  });

  for (let attempt = 0; features.length < bonusCount && attempt < 600; attempt += 1) {
    const type = bonusTypes[features.length];
    const feature = createRandomFeature(type);
    const isNearStart = overlaps(feature, startBuffer, 0);
    const isNearTarget = overlaps(feature, targetBuffer, 0);
    const overlapsObstacle = obstacles.some((obstacle) => overlaps(feature, obstacle, 4));
    const overlapsFeature = features.some((existing) => overlaps(feature, existing, 10));
    const isReachable =
      type !== 'ramp' ||
      isCourseSolvable(start, { x: feature.x + feature.width / 2, y: feature.y + feature.height / 2 }, obstacles);

    if (!isNearStart && !isNearTarget && !overlapsObstacle && !overlapsFeature && isReachable) {
      features.push(feature);
    }
  }

  return features;
}

function generateHole(settings: CourseSettings): Hole {
  for (let attempt = 0; attempt < 250; attempt += 1) {
    const start = { x: randomInteger(70, 150), y: randomInteger(80, 420) };
    const target = { x: randomInteger(650, 730), y: randomInteger(80, 420) };
    const obstacles: Obstacle[] = [];

    for (let obstacleAttempt = 0; obstacleAttempt < settings.obstacleCount * 30 && obstacles.length < settings.obstacleCount; obstacleAttempt += 1) {
      const obstacle = createRandomObstacle(settings.obstacleCount);
      const startBuffer = { x: start.x - 45, y: start.y - 45, width: 90, height: 90 };
      const targetBuffer = { x: target.x - 45, y: target.y - 45, width: 90, height: 90 };
      const nearStart = overlaps(obstacle, startBuffer, 0);
      const nearTarget = overlaps(obstacle, targetBuffer, 0);
      const touchesOtherObstacle = obstacles.some((existing) => overlaps(obstacle, existing, 24));

      if (!nearStart && !nearTarget && !touchesOtherObstacle) {
        obstacles.push(obstacle);
      }
    }

    if (obstacles.length === settings.obstacleCount && isCourseSolvable(start, target, obstacles)) {
      const features = createCourseFeatures(start, target, obstacles, settings.bonusCount);

      if (features.length === settings.bonusCount) {
        return { start, target, obstacles, features };
      }
    }
  }

  const fallbackFeatures: CourseFeature[] = [
    { type: 'booster', shape: 'square', direction: 1, x: 210, y: 220, width: 92, height: 92 },
    { type: 'ramp', shape: 'triangle', x: 470, y: 220, width: 78, height: 58 },
    { type: 'booster', shape: 'circle', direction: -1, x: 590, y: 90, width: 84, height: 84 },
    { type: 'ramp', shape: 'square', x: 460, y: 350, width: 82, height: 82 },
    { type: 'booster', shape: 'triangle', direction: 1, x: 190, y: 350, width: 96, height: 58 },
    { type: 'ramp', shape: 'circle', x: 590, y: 350, width: 84, height: 84 }
  ];

  return {
    start: { x: 90, y: 250 },
    target: { x: 710, y: 250 },
    obstacles: [{ type: 'bar', x: 350, y: 90, width: 28, height: 150 }],
    features: fallbackFeatures.sort(() => Math.random() - 0.5).slice(0, settings.bonusCount)
  };
}

const obstacleCount = ref(8);
const bonusCount = ref(2);
const currentCourse = ref(generateHole({ obstacleCount: obstacleCount.value, bonusCount: bonusCount.value }));

const svgElement = ref<SVGSVGElement | null>(null);
const ball = ref({ ...currentCourse.value.start, velocityX: 0, velocityY: 0 });
const aimPoint = ref({ ...currentCourse.value.start });
const holeStrokes = ref(0);
const isAiming = ref(false);
const isMoving = ref(false);
const completed = ref(false);
const { t } = useI18n();

let animationFrame: number | null = null;
let previousFrameTime = 0;
const jumpTime = ref(0);
let boosterContactFeature: CourseFeature | null = null;
let boosterContactTime = 0;
let rampCooldown = 0;

const jumpOffset = computed(() => (jumpTime.value > 0 ? Math.sin((jumpTime.value / 850) * Math.PI) * 28 : 0));
const ballScale = computed(() => 1 + (jumpOffset.value / 28) * 0.28);
const renderedBallRadius = computed(() => ballRadius * ballScale.value);
const aimGuideEnd = computed(() => {
  const pullX = aimPoint.value.x - ball.value.x;
  const pullY = aimPoint.value.y - ball.value.y;
  const length = Math.hypot(pullX, pullY);

  if (length === 0) {
    return { x: ball.value.x, y: ball.value.y };
  }

  const guideLength = Math.min(length, 170);
  return {
    x: ball.value.x + (pullX / length) * guideLength,
    y: ball.value.y + (pullY / length) * guideLength
  };
});

function getSvgPoint(event: PointerEvent) {
  const bounds = svgElement.value?.getBoundingClientRect();

  if (!bounds) {
    return { x: ball.value.x, y: ball.value.y };
  }

  return {
    x: ((event.clientX - bounds.left) / bounds.width) * courseWidth,
    y: ((event.clientY - bounds.top) / bounds.height) * courseHeight
  };
}

function startAim(event: PointerEvent) {
  if (isMoving.value || completed.value) {
    return;
  }

  event.preventDefault();
  isAiming.value = true;
  aimPoint.value = getSvgPoint(event);
  (event.currentTarget as SVGCircleElement).setPointerCapture(event.pointerId);
}

function updateAim(event: PointerEvent) {
  if (isAiming.value) {
    aimPoint.value = getSvgPoint(event);
  }
}

function releaseAim(event: PointerEvent) {
  if (!isAiming.value) {
    return;
  }

  aimPoint.value = getSvgPoint(event);
  isAiming.value = false;

  const pullX = ball.value.x - aimPoint.value.x;
  const pullY = ball.value.y - aimPoint.value.y;
  const pullLength = Math.hypot(pullX, pullY);

  if (pullLength < 8) {
    return;
  }

  const power = Math.min(pullLength * 0.075, 14);
  ball.value.velocityX = (pullX / pullLength) * power;
  ball.value.velocityY = (pullY / pullLength) * power;
  holeStrokes.value += 1;
  isMoving.value = true;
  previousFrameTime = performance.now();
  animationFrame = requestAnimationFrame(animate);
}

function triangleVertices(obstacle: Obstacle) {
  return [
    { x: obstacle.x, y: obstacle.y + obstacle.height },
    { x: obstacle.x + obstacle.width / 2, y: obstacle.y },
    { x: obstacle.x + obstacle.width, y: obstacle.y + obstacle.height }
  ];
}

function closestPointOnSegment(point: { x: number; y: number }, start: { x: number; y: number }, end: { x: number; y: number }) {
  const segmentX = end.x - start.x;
  const segmentY = end.y - start.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  const progress = Math.max(
    0,
    Math.min(1, ((point.x - start.x) * segmentX + (point.y - start.y) * segmentY) / segmentLengthSquared)
  );

  return {
    x: start.x + segmentX * progress,
    y: start.y + segmentY * progress
  };
}

function isPointInsideTriangle(point: { x: number; y: number }, vertices: { x: number; y: number }[]) {
  const signs = vertices.map((vertex, index) => {
    const next = vertices[(index + 1) % vertices.length];
    return (point.x - next.x) * (vertex.y - next.y) - (vertex.x - next.x) * (point.y - next.y);
  });

  return signs.every((sign) => sign >= 0) || signs.every((sign) => sign <= 0);
}

function resolveTriangleObstacle(obstacle: Obstacle) {
  const vertices = triangleVertices(obstacle);
  const edges = vertices.map((start, index) => ({ start, end: vertices[(index + 1) % vertices.length] }));
  const nearest = edges
    .map((edge) => ({ ...edge, point: closestPointOnSegment(ball.value, edge.start, edge.end) }))
    .map((edge) => ({ ...edge, distance: Math.hypot(ball.value.x - edge.point.x, ball.value.y - edge.point.y) }))
    .sort((first, second) => first.distance - second.distance)[0];
  const inside = isPointInsideTriangle(ball.value, vertices);

  if (!inside && nearest.distance >= ballRadius) {
    return;
  }

  const edgeMidpoint = {
    x: (nearest.start.x + nearest.end.x) / 2,
    y: (nearest.start.y + nearest.end.y) / 2
  };
  const inwardX = (vertices[0].x + vertices[1].x + vertices[2].x) / 3 - edgeMidpoint.x;
  const inwardY = (vertices[0].y + vertices[1].y + vertices[2].y) / 3 - edgeMidpoint.y;
  const distanceX = ball.value.x - nearest.point.x;
  const distanceY = ball.value.y - nearest.point.y;
  const distance = Math.hypot(distanceX, distanceY);
  const normalX = inside ? -inwardX / Math.hypot(inwardX, inwardY) : distanceX / (distance || 1);
  const normalY = inside ? -inwardY / Math.hypot(inwardX, inwardY) : distanceY / (distance || 1);
  const velocityAlongNormal = ball.value.velocityX * normalX + ball.value.velocityY * normalY;

  ball.value.x = nearest.point.x + normalX * ballRadius;
  ball.value.y = nearest.point.y + normalY * ballRadius;

  if (velocityAlongNormal < 0) {
    ball.value.velocityX = (ball.value.velocityX - 2 * velocityAlongNormal * normalX) * 0.7;
    ball.value.velocityY = (ball.value.velocityY - 2 * velocityAlongNormal * normalY) * 0.7;
  }
}

function resolveObstacle(obstacle: Obstacle) {
  if (obstacle.type === 'circle') {
    const centerX = obstacle.x + obstacle.width / 2;
    const centerY = obstacle.y + obstacle.height / 2;
    const deltaX = ball.value.x - centerX;
    const deltaY = ball.value.y - centerY;
    const distance = Math.hypot(deltaX, deltaY) || 1;
    const collisionDistance = obstacle.width / 2 + ballRadius;

    if (distance >= collisionDistance) {
      return;
    }

    const normalX = deltaX / distance;
    const normalY = deltaY / distance;
    const velocityAlongNormal = ball.value.velocityX * normalX + ball.value.velocityY * normalY;
    ball.value.x = centerX + normalX * collisionDistance;
    ball.value.y = centerY + normalY * collisionDistance;
    ball.value.velocityX = (ball.value.velocityX - 2 * velocityAlongNormal * normalX) * 0.7;
    ball.value.velocityY = (ball.value.velocityY - 2 * velocityAlongNormal * normalY) * 0.7;
    return;
  }

  if (obstacle.type === 'triangle') {
    resolveTriangleObstacle(obstacle);
    return;
  }

  const withinX = ball.value.x > obstacle.x - ballRadius && ball.value.x < obstacle.x + obstacle.width + ballRadius;
  const withinY = ball.value.y > obstacle.y - ballRadius && ball.value.y < obstacle.y + obstacle.height + ballRadius;

  if (!withinX || !withinY) {
    return;
  }

  const distances = [
    { side: 'left', value: Math.abs(ball.value.x - (obstacle.x - ballRadius)) },
    { side: 'right', value: Math.abs(ball.value.x - (obstacle.x + obstacle.width + ballRadius)) },
    { side: 'top', value: Math.abs(ball.value.y - (obstacle.y - ballRadius)) },
    { side: 'bottom', value: Math.abs(ball.value.y - (obstacle.y + obstacle.height + ballRadius)) }
  ];
  const nearest = distances.sort((first, second) => first.value - second.value)[0].side;

  if (nearest === 'left') {
    ball.value.x = obstacle.x - ballRadius;
    ball.value.velocityX = -Math.abs(ball.value.velocityX) * 0.7;
  } else if (nearest === 'right') {
    ball.value.x = obstacle.x + obstacle.width + ballRadius;
    ball.value.velocityX = Math.abs(ball.value.velocityX) * 0.7;
  } else if (nearest === 'top') {
    ball.value.y = obstacle.y - ballRadius;
    ball.value.velocityY = -Math.abs(ball.value.velocityY) * 0.7;
  } else {
    ball.value.y = obstacle.y + obstacle.height + ballRadius;
    ball.value.velocityY = Math.abs(ball.value.velocityY) * 0.7;
  }
}

function animate(timestamp: number) {
  const elapsed = timestamp - previousFrameTime;
  const timeScale = Math.min(elapsed / 16.67, 2);
  const previousPosition = { x: ball.value.x, y: ball.value.y };
  previousFrameTime = timestamp;
  jumpTime.value = Math.max(0, jumpTime.value - elapsed);
  rampCooldown = Math.max(0, rampCooldown - elapsed);
  ball.value.x += ball.value.velocityX * timeScale;
  ball.value.y += ball.value.velocityY * timeScale;
  ball.value.velocityX *= Math.pow(0.985, timeScale);
  ball.value.velocityY *= Math.pow(0.985, timeScale);

  if (ball.value.x < ballRadius + 24 || ball.value.x > courseWidth - ballRadius - 24) {
    ball.value.x = Math.max(ballRadius + 24, Math.min(courseWidth - ballRadius - 24, ball.value.x));
    ball.value.velocityX *= -0.72;
  }

  if (ball.value.y < ballRadius + 24 || ball.value.y > courseHeight - ballRadius - 24) {
    ball.value.y = Math.max(ballRadius + 24, Math.min(courseHeight - ballRadius - 24, ball.value.y));
    ball.value.velocityY *= -0.72;
  }

  const speedBeforeFeature = Math.hypot(ball.value.velocityX, ball.value.velocityY);
  let touchingBooster = false;
  currentCourse.value.features.forEach((feature) => {
    const isOnFeature = isBallInFeature(ball.value, feature);
    const crossedFeature = didCrossFeature(previousPosition, ball.value, feature);

    if (!isOnFeature && !crossedFeature) {
      return;
    }

    if (feature.type === 'booster') {
      const direction = feature.direction ?? 1;
      if (boosterContactFeature !== feature) {
        boosterContactFeature = feature;
        boosterContactTime = 0;
      }

      const contactTime = isOnFeature ? boosterContactTime + elapsed : Math.min(elapsed, 16.67);
      const contactProgress = Math.min(contactTime / 700, 1);
      const acceleration = (0.029 + contactProgress * 0.092) * timeScale;
      const nextVelocityX = ball.value.velocityX + direction * acceleration;
      const nextVelocityY = ball.value.velocityY;
      const nextSpeed = Math.hypot(nextVelocityX, nextVelocityY);
      const speedLimit = 14;

      ball.value.velocityX = nextSpeed > speedLimit ? (nextVelocityX / nextSpeed) * speedLimit : nextVelocityX;
      ball.value.velocityY = nextSpeed > speedLimit ? (nextVelocityY / nextSpeed) * speedLimit : nextVelocityY;
      boosterContactTime = contactTime;
      touchingBooster = isOnFeature;
    }

    if (feature.type === 'ramp' && rampCooldown <= 0 && speedBeforeFeature > 1) {
      jumpTime.value = 850;
      rampCooldown = 1000;
    }
  });

  if (!touchingBooster) {
    boosterContactFeature = null;
    boosterContactTime = 0;
  }

  if (jumpTime.value <= 0) {
    currentCourse.value.obstacles.forEach(resolveObstacle);
  }

  const distanceToHole = Math.hypot(ball.value.x - currentCourse.value.target.x, ball.value.y - currentCourse.value.target.y);
  const speed = Math.hypot(ball.value.velocityX, ball.value.velocityY);

  if (distanceToHole < 18 && speed < 5) {
    ball.value.x = currentCourse.value.target.x;
    ball.value.y = currentCourse.value.target.y;
    ball.value.velocityX = 0;
    ball.value.velocityY = 0;
    isMoving.value = false;
    completed.value = true;
    animationFrame = null;
    return;
  }

  if (speed < 0.08) {
    ball.value.velocityX = 0;
    ball.value.velocityY = 0;
    isMoving.value = false;
    animationFrame = null;
    return;
  }

  animationFrame = requestAnimationFrame(animate);
}

function resetHole() {
  stopAnimation();
  const start = currentCourse.value.start;
  ball.value = { ...start, velocityX: 0, velocityY: 0 };
  aimPoint.value = { ...start };
  holeStrokes.value = 0;
  isAiming.value = false;
  isMoving.value = false;
  completed.value = false;
  jumpTime.value = 0;
  boosterContactFeature = null;
  boosterContactTime = 0;
  rampCooldown = 0;
}

function featureVertices(feature: CourseFeature) {
  if (feature.shape === 'triangle') {
    return [
      { x: feature.x, y: feature.y + feature.height },
      { x: feature.x + feature.width / 2, y: feature.y },
      { x: feature.x + feature.width, y: feature.y + feature.height }
    ];
  }

  return [
    { x: feature.x, y: feature.y },
    { x: feature.x + feature.width, y: feature.y },
    { x: feature.x + feature.width, y: feature.y + feature.height },
    { x: feature.x, y: feature.y + feature.height }
  ];
}

function isPointInsidePolygon(point: { x: number; y: number }, vertices: { x: number; y: number }[]) {
  let inside = false;

  for (let index = 0, previousIndex = vertices.length - 1; index < vertices.length; previousIndex = index++) {
    const current = vertices[index];
    const previous = vertices[previousIndex];
    const crossesScanline = current.y > point.y !== previous.y > point.y;
    const intersectionX = ((previous.x - current.x) * (point.y - current.y)) / (previous.y - current.y) + current.x;

    if (crossesScanline && point.x < intersectionX) {
      inside = !inside;
    }
  }

  return inside;
}

function isPointNearPolygon(point: { x: number; y: number }, vertices: { x: number; y: number }[], padding: number) {
  if (isPointInsidePolygon(point, vertices)) {
    return true;
  }

  return vertices.some((vertex, index) => {
    const next = vertices[(index + 1) % vertices.length];
    const closestPoint = closestPointOnSegment(point, vertex, next);

    return Math.hypot(point.x - closestPoint.x, point.y - closestPoint.y) <= padding;
  });
}

function isBallInFeature(point: { x: number; y: number }, feature: CourseFeature) {
  if (feature.shape === 'circle') {
    return Math.hypot(
      point.x - (feature.x + feature.width / 2),
      point.y - (feature.y + feature.height / 2)
    ) <= feature.width / 2 + ballRadius;
  }

  return isPointNearPolygon(point, featureVertices(feature), ballRadius);
}

function didCrossFeature(previous: { x: number; y: number }, current: { x: number; y: number }, feature: CourseFeature) {
  const samples = 5;

  for (let sample = 1; sample <= samples; sample += 1) {
    const progress = sample / samples;
    const point = {
      x: previous.x + (current.x - previous.x) * progress,
      y: previous.y + (current.y - previous.y) * progress
    };

    if (isBallInFeature(point, feature)) {
      return true;
    }
  }

  return false;
}

function trianglePoints(obstacle: Obstacle) {
  return triangleVertices(obstacle).map((vertex) => `${vertex.x},${vertex.y}`).join(' ');
}

function featurePoints(feature: CourseFeature) {
  return featureVertices(feature).map((vertex) => `${vertex.x},${vertex.y}`).join(' ');
}

function rampTexturePath(feature: CourseFeature) {
  const centerX = feature.x + feature.width / 2;

  if (feature.shape === 'triangle') {
    return `M ${feature.x + feature.width * 0.24} ${feature.y + feature.height * 0.68} L ${centerX} ${feature.y + feature.height * 0.45} L ${feature.x + feature.width * 0.76} ${feature.y + feature.height * 0.68}`;
  }

  if (feature.shape === 'circle') {
    return `M ${feature.x + feature.width * 0.25} ${feature.y + feature.height * 0.62} L ${centerX} ${feature.y + feature.height * 0.4} L ${feature.x + feature.width * 0.75} ${feature.y + feature.height * 0.62}`;
  }

  const chevrons = [
    { inset: 12, baseOffset: 8, peakOffset: 12 },
    { inset: 24, baseOffset: 17, peakOffset: 24 },
    { inset: 35, baseOffset: 24, peakOffset: 35 }
  ];
  return chevrons
    .map(({ inset, baseOffset, peakOffset }) => {
      const leftX = feature.x + inset;
      const rightX = feature.x + feature.width - inset;
      const baseY = feature.y + feature.height - baseOffset;
      const peakY = feature.y + peakOffset;

      return `M ${leftX} ${baseY} L ${centerX} ${peakY} L ${rightX} ${baseY}`;
    })
    .join(' ');
}

function featureArrowPath(feature: CourseFeature) {
  const direction = feature.direction ?? 1;
  const centerY = feature.y + feature.height / 2;
  const inset = feature.shape === 'triangle' ? feature.width * 0.36 : feature.shape === 'circle' ? feature.width * 0.26 : 18;
  const headSize = feature.shape === 'triangle' ? 6 : 8;
  const startX = direction === 1 ? feature.x + inset : feature.x + feature.width - inset;
  const endX = direction === 1 ? feature.x + feature.width - inset : feature.x + inset;
  const headX = endX - direction * headSize;

  return `M ${startX} ${centerY} H ${endX} M ${endX} ${centerY} L ${headX} ${centerY - headSize} M ${endX} ${centerY} L ${headX} ${centerY + headSize}`;
}

function stopAnimation() {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function regenerateCourse() {
  currentCourse.value = generateHole({ obstacleCount: obstacleCount.value, bonusCount: bonusCount.value });
  resetHole();
}

onBeforeUnmount(() => {
  stopAnimation();
});
</script>

<template>
  <section class="playground-view">
    <header class="page-intro">
      <p class="eyebrow">{{ t('playground.eyebrow') }}</p>
      <h1>{{ t('playground.title') }}</h1>
      <p class="lede">{{ t('playground.intro') }}</p>
    </header>

    <div class="golf-layout">
      <section class="playground-panel golf-course-panel">
        <div class="playground-panel-heading">
          <div>
            <p class="playground-label">{{ t('playground.courseLabel') }}</p>
            <p class="playground-coordinate">{{ t('playground.randomCourse') }}</p>
          </div>
          <p class="playground-coordinate">{{ t('playground.strokes') }}: {{ holeStrokes }}</p>
        </div>

        <svg
          ref="svgElement"
          class="golf-course"
          viewBox="0 0 800 500"
          :aria-label="t('playground.courseAria')"
          role="application"
          @pointermove="updateAim"
          @pointerup="releaseAim"
          @pointercancel="releaseAim"
        >
          <rect class="golf-course-surface" x="24" y="24" width="752" height="452" rx="20" />
          <template v-for="obstacle in currentCourse.obstacles" :key="`${obstacle.type}-${obstacle.x}-${obstacle.y}`">
            <rect
              v-if="obstacle.type === 'bar'"
              class="golf-obstacle"
              :x="obstacle.x"
              :y="obstacle.y"
              :width="obstacle.width"
              :height="obstacle.height"
              rx="8"
            />
            <circle
              v-else-if="obstacle.type === 'circle'"
              class="golf-obstacle golf-obstacle-circle"
              :cx="obstacle.x + obstacle.width / 2"
              :cy="obstacle.y + obstacle.height / 2"
              :r="obstacle.width / 2"
            />
            <polygon v-else class="golf-obstacle golf-obstacle-triangle" :points="trianglePoints(obstacle)" />
          </template>
          <g
            v-for="feature in currentCourse.features"
            :key="`${feature.type}-${feature.shape}-${feature.x}-${feature.y}`"
            :class="`golf-feature golf-feature-${feature.type}`"
          >
            <rect
              v-if="feature.shape === 'square'"
              class="golf-feature-surface"
              :class="feature.type === 'booster' ? 'golf-booster-surface' : 'golf-ramp-surface'"
              :x="feature.x"
              :y="feature.y"
              :width="feature.width"
              :height="feature.height"
              :rx="feature.type === 'booster' ? 10 : 4"
            />
            <circle
              v-else-if="feature.shape === 'circle'"
              class="golf-feature-surface"
              :class="feature.type === 'booster' ? 'golf-booster-surface' : 'golf-ramp-surface'"
              :cx="feature.x + feature.width / 2"
              :cy="feature.y + feature.height / 2"
              :r="feature.width / 2"
            />
            <polygon
              v-else
              class="golf-feature-surface"
              :class="feature.type === 'booster' ? 'golf-booster-surface' : 'golf-ramp-surface'"
              :points="featurePoints(feature)"
            />
            <path v-if="feature.type === 'booster'" :d="featureArrowPath(feature)" class="golf-feature-arrow" />
            <path v-if="feature.type === 'ramp'" :d="rampTexturePath(feature)" class="golf-ramp-texture" />
          </g>
          <circle class="golf-hole" :cx="currentCourse.target.x" :cy="currentCourse.target.y" r="15" />
          <circle class="golf-hole-center" :cx="currentCourse.target.x" :cy="currentCourse.target.y" r="5" />
          <line
            v-if="isAiming"
            class="golf-aim-guide"
            :x1="ball.x"
            :y1="ball.y"
            :x2="aimGuideEnd.x"
            :y2="aimGuideEnd.y"
          />
          <circle
            class="golf-ball-shadow"
            :cx="ball.x"
            :cy="ball.y + 7"
            :r="renderedBallRadius"
          />
          <circle
            class="golf-ball"
            :class="{ 'golf-ball-aiming': isAiming }"
            :cx="ball.x"
            :cy="ball.y - jumpOffset"
            :r="renderedBallRadius"
            :aria-label="t('playground.ballAria')"
            @pointerdown="startAim"
          />
        </svg>
      </section>

      <aside class="playground-panel golf-info-panel">
        <p class="playground-label">{{ t('playground.controls') }}</p>
        <p class="playground-help">{{ t('playground.help') }}</p>

        <div class="golf-settings" :aria-label="t('playground.settings')">
          <label class="golf-slider">
            <span>
              <span>{{ t('playground.obstacleCount') }}</span>
              <output>{{ obstacleCount }}</output>
            </span>
            <input v-model.number="obstacleCount" type="range" min="0" max="16" step="1" @change="regenerateCourse" />
          </label>
          <label class="golf-slider">
            <span>
              <span>{{ t('playground.bonusCount') }}</span>
              <output>{{ bonusCount }}</output>
            </span>
            <input v-model.number="bonusCount" type="range" min="0" max="6" step="1" @change="regenerateCourse" />
          </label>
        </div>

        <div class="golf-stat-grid">
          <div class="golf-stat">
            <span>{{ t('playground.currentScore') }}</span>
            <strong>{{ holeStrokes }}</strong>
          </div>
        </div>

        <p v-if="completed" class="golf-hole-message">{{ t('playground.holeComplete') }}</p>

        <div class="golf-actions">
          <n-button quaternary @click="resetHole">{{ t('playground.reset') }}</n-button>
          <n-button quaternary @click="regenerateCourse">{{ t('playground.regenerate') }}</n-button>
        </div>
      </aside>
    </div>
  </section>
</template>