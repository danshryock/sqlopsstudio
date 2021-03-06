/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { INavigator, ArrayNavigator } from 'vs/base/common/iterator';

export class HistoryNavigator<T> implements INavigator<T> {

	private _history: Set<T>;
	private _limit: number;
	private _navigator: ArrayNavigator<T>;

	constructor(history: T[] = [], limit: number = 10) {
		this._initialize(history);
		this._limit = limit;
		this._onChange();
	}

	public getHistory(): T[] {
		return this._elements;
	}

	public add(t: T) {
		this._history.delete(t);
		this._history.add(t);
		this._onChange();
	}

	public addIfNotPresent(t: T) {
		if (!this._history.has(t)) {
			this.add(t);
		}
	}

	public next(): T {
		if (this._navigator.next()) {
			return this._navigator.current();
		}
		this.last();
		return null;
	}

	public previous(): T {
		if (this._navigator.previous()) {
			return this._navigator.current();
		}
		this.first();
		return null;
	}

	public current(): T {
		return this._navigator.current();
	}

	public parent(): T {
		return null;
	}

	public first(): T {
		return this._navigator.first();
	}

	public last(): T {
		return this._navigator.last();
	}

	private _onChange() {
		this._reduceToLimit();
		this._navigator = new ArrayNavigator(this._elements);
		this._navigator.last();
	}

	private _reduceToLimit() {
		let data = this._elements;
		if (data.length > this._limit) {
			this._initialize(data.slice(data.length - this._limit));
		}
	}

	private _initialize(history: T[]): void {
		this._history = new Set();
		for (const entry of history) {
			this._history.add(entry);
		}
	}

	private get _elements(): T[] {
		const elements: T[] = [];
		this._history.forEach(e => elements.push(e));
		return elements;
	}
}