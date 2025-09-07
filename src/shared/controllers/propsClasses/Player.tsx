import { Expose } from '@Shared/controllers/meta/decorators';
import React from 'react';

export class Player {
  @Expose()
  name: string = 'Player1';

  @Expose()
  width: number = 100;

  @Expose()
  height: number = 100;

  @Expose()
  x: number = 0;

  @Expose()
  y: number = 0;

  @Expose()
  position: boolean = false;

  @Expose({
    params: [
      { name: 'damage', type: 'number' },
      { name: 'critical', type: 'boolean' },
    ],
  })
  takeDamage(damage: number, critical: boolean) {
    this.width -= critical ? damage * 2 : damage;
    console.log(`${this.name} took ${critical ? 'CRITICAL' : ''} damage! HP=${this.width}`);
  }

  @Expose({
    render: (instance) => (
      <div style={{ background: '#2d2d2dff', padding: '4px', marginTop: '4px' }}>
        <strong>HP Bar:</strong>
        <div
          style={{
            width: '100%',
            background: '#3a3a3aff',
            height: '10px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              width: `${instance.health}%`,
              background: 'green',
              height: '10px',
            }}
          ></div>
        </div>
      </div>
    ),
  })
  hpBar: null = null;
}
