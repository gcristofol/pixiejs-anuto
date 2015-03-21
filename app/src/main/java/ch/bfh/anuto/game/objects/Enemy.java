package ch.bfh.anuto.game.objects;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PointF;

import org.simpleframework.xml.Element;

import ch.bfh.anuto.game.GameObject;
import ch.bfh.anuto.game.data.Path;


public abstract class Enemy extends GameObject {

    /*
    ------ Constants ------
     */

    public static final int TYPEID = 2;

    private static final float HEALTHBAR_WIDTH = 1.0f;
    private static final float HEALTHBAR_HEIGHT = 0.1f;
    private static final float HEALTHBAR_OFFSET = 0.6f;

    /*
    ------ Members -----
     */

    @Element(name="path")
    protected Path mPath = null;
    protected int mWayPointIndex = 0;

    protected int mHealth = 100;
    protected int mHealthMax = 100;
    protected float mSpeed = 1.0f;

    protected Paint mHealthBarBg;
    protected Paint mHealthBarFg;

    /*
    ------ Constructors ------
     */

    protected Enemy() {
        mHealthBarBg = new Paint();
        mHealthBarBg.setColor(Color.BLACK);
        mHealthBarFg = new Paint();
        mHealthBarFg.setColor(Color.GREEN);
    }

    /*
    ------ Public Methods ------
     */

    @Override
    public int getTypeId() {
        return TYPEID;
    }


    public Path getPath() {
        return mPath;
    }

    public void setPath(Path path) {
        mPath = path;
        mWayPointIndex = 0;
    }


    public PointF getWayPoint() {
        return mPath.getWayPoints().get(mWayPointIndex);
    }

    protected void nextWayPoint() {
        mWayPointIndex++;
    }

    protected boolean hasWayPoint() {
        return mPath != null && mPath.getWayPoints().size() > mWayPointIndex;
    }


    public void damage(int dmg) {
        mHealth -= dmg;

        if (mHealth <= 0) {
            remove();
        }
    }

    public void heal(int val) {
        mHealth += val;
    }


    @Override
    public void tick() {
        if (!hasWayPoint()) {
            remove();
            return;
        }

        if (getDistanceTo(getWayPoint()) < mSpeed) {
            setPosition(getWayPoint());
            nextWayPoint();
        }
        else {
            move(getDirectionTo(getWayPoint()), mSpeed);
        }
    }

    @Override
    public void draw(Canvas canvas) {
        drawHealthBar(canvas);
        mSprite.draw(canvas);
    }

    protected void drawHealthBar(Canvas canvas) {
        canvas.save();
        canvas.translate(-HEALTHBAR_WIDTH/2f, -HEALTHBAR_OFFSET);

        canvas.drawRect(0, 0, HEALTHBAR_WIDTH, HEALTHBAR_HEIGHT, mHealthBarBg);
        canvas.drawRect(0, 0, mHealth * HEALTHBAR_WIDTH / mHealthMax, HEALTHBAR_HEIGHT, mHealthBarFg);

        canvas.restore();
    }
}